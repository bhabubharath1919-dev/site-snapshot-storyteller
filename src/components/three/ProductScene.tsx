import { useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { ProductSlug } from "@/lib/specs";
import { SfiModel, type WindowVariant } from "./SfiModel";
import { Stage } from "./Stage";
import { emptyState, timeline, type SceneState } from "./timeline";

function Director({
  kind,
  progress,
  state,
}: {
  kind: ProductSlug;
  progress: MutableRefObject<number>;
  state: MutableRefObject<SceneState>;
}) {
  const camera = useThree((s) => s.camera);
  const current = useRef(progress.current);

  useFrame((_, delta) => {
    // Critically-damped follow: when scrolling stops the scene settles and holds.
    const k = 1 - Math.exp(-Math.min(delta, 0.1) * 5.5);
    current.current += (progress.current - current.current) * k;
    const next = timeline(kind, current.current);
    state.current = next;
    camera.position.set(next.cam[0], next.cam[1], next.cam[2]);
    camera.lookAt(next.target[0], next.target[1], next.target[2]);
  });
  return null;
}

export default function ProductScene({
  kind,
  variant,
  progress,
  active,
  lowPower,
  onReady,
}: {
  kind: ProductSlug;
  variant?: WindowVariant | undefined;
  progress: MutableRefObject<number>;
  active: boolean;
  lowPower?: boolean | undefined;
  onReady?: () => void;
}) {
  const state = useRef<SceneState>(timeline(kind, progress.current) ?? emptyState());
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={lowPower ? 1 : [1, 1.75]}
      gl={{ antialias: !lowPower, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 32, near: 0.1, far: 60, position: [0, 0, 7] }}
      onCreated={() => onReady?.()}
    >
      <Stage />
      <Director kind={kind} progress={progress} state={state} />
      <SfiModel kind={kind} variant={variant} state={state} />
    </Canvas>
  );
}

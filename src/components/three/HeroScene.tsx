import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { SfiModel } from "./SfiModel";
import { Stage } from "./Stage";
import { emptyState, type SceneState } from "./timeline";

function Rig({ state, offsetX }: { state: React.MutableRefObject<SceneState>; offsetX: number }) {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock, camera, size }, delta) => {
    // Portrait screens: pull the camera back and aim low so the model sits above the headline.
    const narrow = size.width < size.height;
    const t = clock.getElapsedTime();
    const scroll = typeof window !== "undefined" ? window.scrollY / window.innerHeight : 0;
    const s = state.current;
    s.internal += delta * 2.4;
    s.flow += delta * 0.9;
    s.flowVisible = 0.75;
    if (group.current) {
      group.current.rotation.y = -0.55 + Math.sin(t * 0.18) * 0.35 + scroll * 1.2;
      group.current.rotation.x = 0.12 + Math.sin(t * 0.25) * 0.04;
    }
    const a = t * 0.08;
    camera.position.set(Math.sin(a) * 0.6, 0.5 + Math.sin(t * 0.2) * 0.15, (narrow ? 13 : 7.4) - scroll * 0.8);
    camera.lookAt(offsetX * 0.35, narrow ? -1.6 : 0, 0);
  });
  return (
    <group position={[offsetX, -0.1, 0]}>
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.6}>
        <group ref={group}>
          <SfiModel kind="rotor" state={state} showLabels={false} />
        </group>
      </Float>
    </group>
  );
}

export default function HeroScene({
  active,
  offsetX,
  lowPower,
  onReady,
}: {
  active: boolean;
  offsetX: number;
  lowPower?: boolean;
  onReady?: () => void;
}) {
  const state = useRef<SceneState>(emptyState());
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={lowPower ? 1 : [1, 1.75]}
      gl={{ antialias: !lowPower, alpha: true }}
      camera={{ fov: 32, near: 0.1, far: 60, position: [0, 0.5, 7.4] }}
      onCreated={() => onReady?.()}
    >
      <Stage />
      <Rig state={state} offsetX={offsetX} />
    </Canvas>
  );
}

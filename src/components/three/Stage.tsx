import { Environment, Lightformer } from "@react-three/drei";
import { SCENE } from "./palette";

/** Shared studio lighting: procedural light-formers give metallic reflections without network HDRs. */
export function Stage() {
  return (
    <>
      <fog attach="fog" args={[SCENE.background, 9, 24]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 7, 6]} intensity={2.2} color={SCENE.white} />
      <directionalLight position={[-6, 1.5, -5]} intensity={2.4} color={SCENE.primary} />
      <pointLight position={[0, -3, 3]} intensity={6} color={SCENE.highlight} distance={10} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} color={SCENE.white} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[10, 4, 1]} />
        <Lightformer form="rect" intensity={2.2} color={SCENE.white} position={[5, 1, 4]} rotation-y={-Math.PI / 4} scale={[2, 8, 1]} />
        <Lightformer form="rect" intensity={3.5} color={SCENE.primary} position={[-5, 0, -2]} rotation-y={Math.PI / 2.5} scale={[3, 10, 1]} />
        <Lightformer form="ring" intensity={2} color={SCENE.highlight} position={[0, 0, 6]} scale={3} />
        <Lightformer form="rect" intensity={0.6} color={SCENE.white} position={[0, -5, 0]} rotation-x={-Math.PI / 2} scale={[10, 10, 1]} />
      </Environment>
    </>
  );
}

import { useMemo, useRef, type MutableRefObject, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";
import type { ProductSlug } from "@/lib/specs";
import type { SceneState, Vec3 } from "./timeline";
import { SCENE } from "./palette";

export type WindowVariant = "single" | "double" | "full";

type PartDef = {
  id: string;
  label: string;
  explode: Vec3;
  far: Vec3;
  labelOffset: Vec3;
  node: ReactNode;
};

/* ---------- geometry helpers ---------- */

function circlePath(x: number, y: number, r: number, hole = true) {
  const p = new THREE.Path();
  p.absarc(x, y, r, 0, Math.PI * 2, hole);
  return p;
}

function ringShape(outer: number, inner: number | null, bolts?: { r: number; at: number; n: number; phase?: number }) {
  const s = new THREE.Shape();
  s.absarc(0, 0, outer, 0, Math.PI * 2, false);
  if (inner) s.holes.push(circlePath(0, 0, inner));
  if (bolts) {
    for (let i = 0; i < bolts.n; i++) {
      const a = (bolts.phase ?? 0) + (i / bolts.n) * Math.PI * 2;
      s.holes.push(circlePath(Math.cos(a) * bolts.at, Math.sin(a) * bolts.at, bolts.r));
    }
  }
  return s;
}

function extrude(shape: THREE.Shape, depth: number, bevel = 0.012) {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: bevel > 0,
    bevelSize: bevel,
    bevelThickness: bevel,
    bevelSegments: 2,
    curveSegments: 72,
  });
  g.translate(0, 0, -depth / 2);
  g.computeVertexNormals();
  return g;
}

/* ---------- materials ---------- */

function useMaterials() {
  return useMemo(() => {
    const body = new THREE.MeshStandardMaterial({
      color: SCENE.carbonSteel,
      metalness: 0.85,
      roughness: 0.42,
      side: THREE.DoubleSide,
    });
    const bright = new THREE.MeshStandardMaterial({
      color: SCENE.stainless,
      metalness: 1,
      roughness: 0.24,
    });
    const rotor = new THREE.MeshStandardMaterial({
      color: SCENE.polished,
      metalness: 1,
      roughness: 0.16,
      side: THREE.DoubleSide,
    });
    const glass = new THREE.MeshPhysicalMaterial({
      color: SCENE.glass,
      metalness: 0,
      roughness: 0.03,
      transparent: true,
      opacity: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.02,
      envMapIntensity: 2.2,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const tubeGlass = glass.clone();
    tubeGlass.opacity = 0.32;
    const gasket = new THREE.MeshStandardMaterial({ color: SCENE.graphite, roughness: 0.85, metalness: 0.1 });
    const glow = new THREE.MeshBasicMaterial({
      color: SCENE.highlight,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const fluid = new THREE.MeshPhysicalMaterial({
      color: SCENE.fluid,
      roughness: 0.05,
      metalness: 0,
      transparent: true,
      opacity: 0.85,
      clearcoat: 1,
      envMapIntensity: 2,
    });
    const arrow = new THREE.MeshBasicMaterial({ color: SCENE.highlight, transparent: true, opacity: 0 });
    return { body, bright, rotor, glass, tubeGlass, gasket, glow, fluid, arrow };
  }, []);
}

/* ---------- reusable sub-assemblies ---------- */

function Bolts({ radius, z, dir, mat, count = 8 }: { radius: number; z: number; dir: 1 | -1; mat: THREE.Material; count?: number }) {
  const items = Array.from({ length: count }, (_, i) => {
    const a = Math.PI / count + (i / count) * Math.PI * 2;
    return [Math.cos(a) * radius, Math.sin(a) * radius] as const;
  });
  return (
    <group>
      {items.map(([x, y], i) => (
        <group key={i} position={[x, y, z]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh material={mat} position={[0, dir * 0.035, 0]}>
            <cylinderGeometry args={[0.072, 0.072, 0.07, 6]} />
          </mesh>
          <mesh material={mat} position={[0, -dir * 0.16, 0]}>
            <cylinderGeometry args={[0.036, 0.036, 0.32, 12]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Body({ geo, mat }: { geo: ReturnType<typeof useBodyGeometry>; mat: THREE.Material }) {
  return (
    <group>
      <mesh geometry={geo.chamber} material={mat} />
      {[0, 1, 2, 3].map((i) => {
        const a = Math.PI / 4 + (i * Math.PI) / 2;
        return (
          <mesh key={i} material={mat} position={[Math.cos(a) * geo.lugR, Math.sin(a) * geo.lugR, 0]} rotation={[0, 0, a]}>
            <boxGeometry args={[0.34, 0.34, 0.84]} />
          </mesh>
        );
      })}
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh material={mat} position={[s * 1.32, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.4, 0.4, 0.82, 48, 1, true]} />
          </mesh>
          <mesh material={mat} position={[s * 1.68, 0, 0]} rotation={[0, 0, (s * Math.PI) / 2]}>
            <cylinderGeometry args={[0.4, 0.52, 0.22, 48, 1, true]} />
          </mesh>
          <mesh geometry={geo.flange} material={mat} position={[s * 1.9, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
          <mesh geometry={geo.raisedFace} material={mat} position={[s * 2.015, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
        </group>
      ))}
    </group>
  );
}

function useBodyGeometry(variant: WindowVariant) {
  return useMemo(() => {
    const full = variant === "full";
    const w = full ? 0.8 : 0.6; // window aperture radius
    const bodyR = full ? 1.08 : 1.0;
    const innerR = full ? 0.84 : 0.72;
    const coverR = full ? 1.2 : 1.12;
    const boltR = full ? 1.0 : 0.92;
    return {
      w,
      bodyR,
      innerR,
      coverR,
      boltR,
      lugR: bodyR - 0.02,
      chamber: extrude(ringShape(bodyR, innerR), 0.84, 0.02),
      flange: extrude(ringShape(1.1, 0.4, { r: 0.075, at: 0.82, n: 8, phase: Math.PI / 8 }), 0.2, 0.015),
      raisedFace: extrude(ringShape(0.64, 0.4), 0.03, 0.004),
      gasket: extrude(ringShape(w + 0.14, w), 0.03, 0.004),
      cover: extrude(ringShape(coverR, w - 0.02, { r: 0.045, at: boltR, n: 8, phase: Math.PI / 8 }), 0.12, 0.014),
      blind: extrude(ringShape(coverR, null, { r: 0.045, at: boltR, n: 8, phase: Math.PI / 8 }), 0.12, 0.014),
    };
  }, [variant]);
}

/* ---------- main model ---------- */

export function SfiModel({
  kind,
  variant = "double",
  state,
  showLabels = true,
}: {
  kind: ProductSlug;
  variant?: WindowVariant | undefined;
  state: MutableRefObject<SceneState>;
  showLabels?: boolean | undefined;
}) {
  const m = useMaterials();
  const g = useBodyGeometry(variant);
  const vertical = kind === "drip-tube";
  const twoWindows = variant !== "single";

  const partRefs = useRef<Record<string, THREE.Group | null>>({});
  const labelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const lineRefs = useRef<Record<string, { material: THREE.Material } | null>>({});
  const internalRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const beamRef = useRef<THREE.Group>(null);
  const dropRefs = useRef<(THREE.Mesh | null)[]>([]);
  const arrowsRef = useRef<THREE.Group>(null);

  const parts: PartDef[] = useMemo(() => {
    const list: PartDef[] = [];
    const up = (y: number): Vec3 => (vertical ? [-y, 0, 0] : [0, y, 0]);

    // Internal element first — it is the hero of the first scene.
    if (kind === "rotor") {
      list.push({
        id: "rotor",
        label: "Rotor / impeller",
        explode: [0, 0, 1.0],
        far: [0, 0, 0],
        labelOffset: up(1.25),
        node: (
          <group ref={internalRef}>
            <mesh material={m.rotor} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.11, 0.11, 0.22, 32]} />
            </mesh>
            <mesh material={m.rotor} position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.06, 0.09, 0.05, 32]} />
            </mesh>
            {Array.from({ length: 6 }, (_, i) => {
              const a = (i / 6) * Math.PI * 2;
              return (
                <group key={i} rotation={[0, 0, a]}>
                  <mesh material={m.rotor} position={[0.33, 0, 0]} rotation={[0.42, 0, 0]}>
                    <boxGeometry args={[0.44, 0.17, 0.025]} />
                  </mesh>
                </group>
              );
            })}
          </group>
        ),
      });
      list.push({
        id: "shaft",
        label: "Rotor shaft & support",
        explode: [0, 0, -0.9],
        far: [0, 0, 0],
        labelOffset: up(-1.25),
        node: (
          <group>
            <mesh material={m.bright} position={[0, 0, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.56, 16]} />
            </mesh>
            <mesh material={m.bright} position={[0, 0, -0.34]}>
              <boxGeometry args={[0.06, g.innerR * 2 - 0.02, 0.05]} />
            </mesh>
          </group>
        ),
      });
    }

    if (kind === "flapper") {
      list.push({
        id: "flapper",
        label: "Flapper element",
        explode: [0, 0, 1.1],
        far: [0, 0, 0],
        labelOffset: [0, -1.3, 0],
        node: (
          <group ref={internalRef} position={[0, 0.6, 0]}>
            <mesh material={m.rotor} position={[0, -0.47, 0]}>
              <boxGeometry args={[0.035, 0.86, 0.5]} />
            </mesh>
            <mesh material={m.rotor} position={[0, -0.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 0.5, 24]} />
            </mesh>
            <mesh material={m.rotor} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.055, 0.055, 0.5, 24]} />
            </mesh>
          </group>
        ),
      });
      list.push({
        id: "hinge",
        label: "Hinge / pivot pin",
        explode: [0, 0, -1.1],
        far: [0, 0, 0],
        labelOffset: [0, 1.0, 0],
        node: (
          <group position={[0, 0.6, 0]}>
            <mesh material={m.bright} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.8, 16]} />
            </mesh>
            {[-1, 1].map((s) => (
              <mesh key={s} material={m.bright} position={[0, 0.06, s * 0.36]}>
                <boxGeometry args={[0.12, 0.16, 0.05]} />
              </mesh>
            ))}
          </group>
        ),
      });
    }

    if (kind === "drip-tube") {
      list.push({
        id: "drip",
        label: "Drip tube",
        explode: [2.6, 0, 0],
        far: [0, 0, 0],
        labelOffset: [0.2, 0, 1.0],
        node: (
          <group>
            <mesh material={m.tubeGlass} position={[0.58, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.085, 0.07, 0.76, 32, 1, true]} />
            </mesh>
            <mesh material={m.bright} position={[0.96, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.16, 0.16, 0.08, 32]} />
            </mesh>
            <mesh material={m.bright} position={[0.21, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.072, 0.012, 8, 32]} />
            </mesh>
          </group>
        ),
      });
    }

    list.push({
      id: "body",
      label: "Main body",
      explode: [0, 0, 0],
      far: vertical ? [7, 0, 0] : [0, -7, 0],
      labelOffset: vertical ? [1.3, 0, 1.2] : [-1.9, 1.35, 0],
      node: <Body geo={g} mat={m.body} />,
    });

    // Front (+Z) stack
    list.push(
      {
        id: "gasket-f",
        label: "Gasket",
        explode: [0, 0, 1.75],
        far: [0, 0, 8],
        labelOffset: up(-1.15),
        node: <mesh geometry={g.gasket} material={m.gasket} position={[0, 0, 0.435]} />,
      },
      {
        id: "glass-f",
        label: "Front viewing glass",
        explode: [0, 0, 2.45],
        far: [0, 0, 9],
        labelOffset: up(1.25),
        node: (
          <mesh material={m.glass} position={[0, 0, 0.485]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[g.w + 0.1, g.w + 0.1, 0.07, 72]} />
          </mesh>
        ),
      },
      {
        id: "cover-f",
        label: "Cover plate",
        explode: [0, 0, 3.15],
        far: [0, 0, 10],
        labelOffset: up(-1.4),
        node: <mesh geometry={g.cover} material={m.bright} position={[0, 0, 0.585]} />,
      },
      {
        id: "bolts-f",
        label: "Bolts & fasteners",
        explode: [0, 0, 3.95],
        far: [0, 0, 11],
        labelOffset: up(1.45),
        node: <Bolts radius={g.boltR} z={0.645} dir={1} mat={m.bright} />,
      },
    );

    // Rear (-Z) stack
    list.push({
      id: "gasket-r",
      label: "Rear gasket",
      explode: [0, 0, -1.75],
      far: [0, 0, -8],
      labelOffset: up(1.15),
      node: <mesh geometry={g.gasket} material={m.gasket} position={[0, 0, -0.435]} />,
    });
    if (twoWindows) {
      list.push({
        id: "glass-r",
        label: "Rear viewing glass",
        explode: [0, 0, -2.45],
        far: [0, 0, -9],
        labelOffset: up(-1.25),
        node: (
          <mesh material={m.glass} position={[0, 0, -0.485]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[g.w + 0.1, g.w + 0.1, 0.07, 72]} />
          </mesh>
        ),
      });
    }
    list.push(
      {
        id: "cover-r",
        label: twoWindows ? "Rear cover plate" : "Blind cover plate",
        explode: [0, 0, -3.15],
        far: [0, 0, -10],
        labelOffset: up(1.4),
        node: <mesh geometry={twoWindows ? g.cover : g.blind} material={m.bright} position={[0, 0, -0.585]} />,
      },
      {
        id: "bolts-r",
        label: "Rear fasteners",
        explode: [0, 0, -3.95],
        far: [0, 0, -11],
        labelOffset: up(-1.45),
        node: <Bolts radius={g.boltR} z={-0.645} dir={-1} mat={m.bright} />,
      },
    );
    return list;
  }, [kind, g, m, vertical, twoWindows]);

  /* particles flowing along +X through the line */
  const particleGeo = useMemo(() => {
    const n = 280;
    const base = new Float32Array(n * 4);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random());
      base[i * 4] = Math.random() * 5 - 2.5; // x seed
      base[i * 4 + 1] = Math.cos(a) * r;
      base[i * 4 + 2] = Math.sin(a) * r;
      base[i * 4 + 3] = 0.6 + Math.random() * 0.8; // speed
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    geo.userData["base"] = base;
    return geo;
  }, []);

  const particleMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: SCENE.highlight,
        size: 0.028,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const s = state.current;

    for (const part of parts) {
      const grp = partRefs.current[part.id];
      if (!grp) continue;
      const farK = 1 - s.gather;
      tmp.set(
        part.explode[0] * s.explode + part.far[0] * farK,
        part.explode[1] * s.explode + part.far[1] * farK,
        part.explode[2] * s.explode + part.far[2] * farK,
      );
      grp.position.copy(tmp);
      const isFar = part.far[0] !== 0 || part.far[1] !== 0 || part.far[2] !== 0;
      grp.visible = !isFar || s.gather > 0.01;

      const lab = labelRefs.current[part.id];
      const show = s.labels * (grp.visible ? 1 : 0);
      if (lab) {
        lab.style.opacity = String(show);
        lab.style.display = show > 0.01 ? "block" : "none";
      }
      const ln = lineRefs.current[part.id];
      if (ln) {
        (ln.material as THREE.Material & { opacity: number }).opacity = show * 0.8;
        (ln as unknown as THREE.Object3D).visible = show > 0.01;
      }
    }

    // body x-ray (cutaway view)
    const bodyOpacity = 1 - s.xray * 0.78;
    m.body.transparent = bodyOpacity < 0.999;
    m.body.opacity = bodyOpacity;
    m.body.depthWrite = bodyOpacity > 0.999;

    if (internalRef.current) internalRef.current.rotation.z = s.internal;

    // particles
    const pts = particlesRef.current;
    if (pts) {
      particleMat.opacity = s.flowVisible * 0.9;
      pts.visible = s.flowVisible > 0.01;
      if (pts.visible) {
        const base = particleGeo.userData["base"] as Float32Array;
        const pos = particleGeo.attributes["position"] as THREE.BufferAttribute;
        const arr = pos.array as Float32Array;
        const n = base.length / 4;
        const isolated = s.gather < 0.5;
        for (let i = 0; i < n; i++) {
          let x = base[i * 4]! + s.flow * 0.35 * base[i * 4 + 3]!;
          x = ((((x + 2.5) % 5) + 5) % 5) - 2.5;
          const inChamber = Math.abs(x) < 0.85;
          const spread = isolated ? 0.75 : inChamber ? g.innerR * 0.9 : 0.36;
          let y = base[i * 4 + 1]! * spread;
          // rotor: particles curl around the impeller
          if (kind === "rotor" && inChamber) y += Math.sin(x * 3) * 0.08;
          arr[i * 3] = x;
          arr[i * 3 + 1] = y;
          arr[i * 3 + 2] = base[i * 4 + 2]! * (inChamber || isolated ? 0.3 : 0.36);
        }
        pos.needsUpdate = true;
      }
    }

    // flow arrows
    if (arrowsRef.current) {
      m.arrow.opacity = s.flowVisible;
      arrowsRef.current.visible = s.flowVisible > 0.01;
      arrowsRef.current.position.x = ((s.flow * 0.2) % 0.6) - 0.3;
    }

    // light beam through opposing windows
    if (beamRef.current) {
      m.glow.opacity = s.beam * 0.22;
      beamRef.current.visible = s.beam > 0.01;
    }

    // drip-tube droplets: form at tip, detach, accelerate under gravity
    if (kind === "drip-tube") {
      const tip = 0.19;
      const fall = 0.92;
      dropRefs.current.forEach((d, i) => {
        if (!d) return;
        const ph = (((s.flow * 0.9 + i * 0.5) % 1) + 1) % 1;
        if (ph < 0.45) {
          const k = ph / 0.45;
          const sc = 0.35 + 0.65 * k;
          d.scale.set(sc * 1.1, sc, sc);
          d.position.set(tip - 0.045 * sc, 0, 0);
        } else {
          const t = (ph - 0.45) / 0.55;
          d.scale.set(1.15, 0.92, 0.92);
          d.position.set(tip - 0.05 - fall * t * t, 0, 0);
        }
        d.visible = s.gather > 0.4 || s.explode < 0.2;
      });
    }
  });

  const inner = (
    <group>
      {parts.map((part, idx) => (
        <group key={part.id} ref={(el) => void (partRefs.current[part.id] = el)}>
          {part.node}
          {showLabels && (
            <>
              <Line
                ref={(el) => void (lineRefs.current[part.id] = el as unknown as { material: THREE.Material })}
                points={[[0, 0, 0], part.labelOffset]}
                color={SCENE.highlight}
                lineWidth={1}
                transparent
                opacity={0}
              />
              <Html position={part.labelOffset} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
                <div
                  ref={(el) => void (labelRefs.current[part.id] = el)}
                  className="scene-label"
                  style={{ opacity: 0, display: "none", transform: "translate(6px, -50%)" }}
                >
                  {String(idx + 1).padStart(2, "0")} · {part.label}
                </div>
              </Html>
            </>
          )}
        </group>
      ))}

      <points ref={particlesRef} geometry={particleGeo} material={particleMat} />

      {kind === "flapper" && (
        <group ref={arrowsRef} position={[0, 1.55, 0]}>
          {[-1.2, 0, 1.2].map((x) => (
            <group key={x} position={[x, 0, 0]}>
              <mesh material={m.arrow} rotation={[0, 0, Math.PI / 2]} position={[-0.15, 0, 0]}>
                <cylinderGeometry args={[0.012, 0.012, 0.4, 8]} />
              </mesh>
              <mesh material={m.arrow} rotation={[0, 0, -Math.PI / 2]} position={[0.1, 0, 0]}>
                <coneGeometry args={[0.05, 0.12, 16]} />
              </mesh>
            </group>
          ))}
        </group>
      )}

      {kind === "full-view" && (
        <group ref={beamRef}>
          <mesh material={m.glow} position={[0, 0, twoWindows ? 0 : 1.6]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[g.w * 0.9, g.w * 0.9, twoWindows ? 7 : 3.2, 48, 1, true]} />
          </mesh>
          <mesh material={m.glow} position={[0, 0, twoWindows ? 0 : 1.6]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[g.w * 0.45, g.w * 0.45, twoWindows ? 7 : 3.2, 48, 1, true]} />
          </mesh>
        </group>
      )}

      {kind === "drip-tube" &&
        [0, 1].map((i) => (
          <mesh key={i} ref={(el) => void (dropRefs.current[i] = el)} material={m.fluid}>
            <sphereGeometry args={[0.055, 24, 16]} />
          </mesh>
        ))}
    </group>
  );

  return vertical ? <group rotation={[0, 0, Math.PI / 2]}>{inner}</group> : inner;
}

import type { ProductSlug } from "@/lib/specs";

export type Vec3 = [number, number, number];

export type SceneState = {
  /** 0 = only the internal element is on stage, 1 = every part is in the scene */
  gather: number;
  /** 0 = assembled, 1 = fully exploded */
  explode: number;
  /** rotor angle / flapper deflection (rad) */
  internal: number;
  /** scroll-driven flow phase (particles, droplets) */
  flow: number;
  flowVisible: number;
  beam: number;
  labels: number;
  xray: number;
  cam: Vec3;
  target: Vec3;
};

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const ss = (a: number, b: number, p: number) => {
  const t = clamp((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const mixV = (a: Vec3, b: Vec3, t: number): Vec3 => [
  mix(a[0], b[0], t),
  mix(a[1], b[1], t),
  mix(a[2], b[2], t),
];

type Key = [number, Vec3, Vec3];

function path(keys: Key[], p: number): { cam: Vec3; target: Vec3 } {
  const first = keys[0]!;
  if (p <= first[0]) return { cam: first[1], target: first[2] };
  for (let i = 0; i < keys.length - 1; i++) {
    const [pa, ca, ta] = keys[i]!;
    const [pb, cb, tb] = keys[i + 1]!;
    if (p <= pb) {
      const t = ss(pa, pb, p);
      return { cam: mixV(ca, cb, t), target: mixV(ta, tb, t) };
    }
  }
  const last = keys[keys.length - 1]!;
  return { cam: last[1], target: last[2] };
}

function orbit(p: number, from: number, start: Key, sweep: number, endHeight?: number) {
  const [, c, t] = start;
  const dx = c[0] - t[0];
  const dz = c[2] - t[2];
  const d = Math.hypot(dx, dz);
  const a0 = Math.atan2(dx, dz);
  const k = ss(from, 1, p);
  const a = a0 + sweep * k;
  const h = mix(c[1], endHeight ?? c[1], k);
  return {
    cam: [t[0] + Math.sin(a) * d, h, t[2] + Math.cos(a) * d] as Vec3,
    target: t,
  };
}

const O: Vec3 = [0, 0, 0];

export function timeline(kind: ProductSlug, p: number): SceneState {
  switch (kind) {
    case "rotor": {
      const keys: Key[] = [
        [0, [0, 0, 7.5], O],
        [0.14, [0, 0, 2.3], O],
        [0.34, [1.5, 0.5, 2.5], O],
        [0.48, [7.2, 3.2, 6.6], [0, 0, 0.2]],
        [0.6, [6.8, 2.6, 7.0], [0, 0, 0.2]],
        [0.8, [4.6, 1.8, 5.2], O],
      ];
      const cam = p < 0.8 ? path(keys, p) : orbit(p, 0.8, keys[5]!, Math.PI * 1.6, 1.2);
      return {
        gather: ss(0.36, 0.48, p),
        explode: ss(0.34, 0.46, p) * (1 - ss(0.6, 0.78, p)),
        internal: p * 70,
        flow: p * 30,
        flowVisible: ss(0.12, 0.2, p) * (1 - ss(0.34, 0.4, p)) + ss(0.86, 0.92, p) * 0.5,
        beam: 0,
        labels: ss(0.46, 0.5, p) * (1 - ss(0.58, 0.61, p)),
        xray: 0,
        ...cam,
      };
    }
    case "flapper": {
      const keys: Key[] = [
        [0, [0, -0.1, 6.5], [0, 0.1, 0]],
        [0.15, [0.4, 0.1, 2.4], [0, 0.15, 0]],
        [0.34, [2.8, 1.2, 4.8], O],
        [0.5, [7.0, 3.0, 7.0], [0, 0, 0.2]],
        [0.6, [6.8, 2.5, 7.0], [0, 0, 0.2]],
        [0.74, [3.8, 1.2, 5.2], O],
        [0.86, [0.5, 0.3, 5.0], O],
      ];
      const cam = p < 0.9 ? path(keys, p) : orbit(p, 0.9, keys[6]!, Math.PI * 1.2, 1.4);
      const flowA = ss(0.18, 0.26, p) * (1 - ss(0.36, 0.42, p));
      const flowB = ss(0.74, 0.8, p) * (1 - ss(0.93, 0.98, p));
      const deflect =
        0.82 * (ss(0.2, 0.34, p) * (1 - ss(0.36, 0.42, p)) + ss(0.76, 0.84, p) * (1 - ss(0.93, 0.98, p)));
      return {
        gather: ss(0.16, 0.3, p),
        explode: ss(0.4, 0.5, p) * (1 - ss(0.6, 0.72, p)),
        internal: deflect + Math.sin(p * 220) * 0.035 * (flowA + flowB),
        flow: p * 30,
        flowVisible: flowA + flowB,
        beam: 0,
        labels: ss(0.48, 0.52, p) * (1 - ss(0.58, 0.61, p)),
        xray: 0,
        ...cam,
      };
    }
    case "full-view": {
      const keys: Key[] = [
        [0, [4.8, 1.6, 6.2], O],
        [0.14, [3.0, 1.0, 4.6], O],
        [0.3, [0.35, 0.15, 2.2], [0, 0, 0.3]],
        [0.46, [7.0, 3.0, 7.0], [0, 0, 0.2]],
        [0.56, [6.8, 2.6, 7.0], [0, 0, 0.2]],
        [0.7, [5.0, 1.5, 5.0], O],
        [0.8, [6.2, 1.1, 0.6], O],
      ];
      const cam = p < 0.86 ? path(keys, p) : orbit(p, 0.86, keys[6]!, Math.PI * 2, 1.6);
      return {
        gather: 1,
        explode: ss(0.36, 0.46, p) * (1 - ss(0.56, 0.68, p)),
        internal: 0,
        flow: p * 26,
        flowVisible: ss(0.14, 0.22, p) * (1 - ss(0.34, 0.38, p)) + ss(0.7, 0.76, p) * 0.7,
        beam: ss(0.72, 0.78, p) * (1 - ss(0.88, 0.92, p)),
        labels: ss(0.44, 0.48, p) * (1 - ss(0.54, 0.57, p)),
        xray: ss(0.93, 0.98, p),
        ...cam,
      };
    }
    case "drip-tube": {
      const keys: Key[] = [
        [0, [0, 0.6, 6.2], [0, 0.4, 0]],
        [0.14, [0.3, 0.3, 2.5], [0, 0.15, 0]],
        [0.34, [1.2, 0.2, 2.8], [0, 0, 0]],
        [0.48, [7.4, 2.4, 7.0], [0, 0.6, 0]],
        [0.56, [7.0, 2.0, 7.0], [0, 0.6, 0]],
        [0.72, [4.0, 0.8, 5.6], O],
        [0.8, [0.5, 0.2, 6.4], O],
      ];
      const cam = p < 0.86 ? path(keys, p) : orbit(p, 0.86, keys[6]!, Math.PI * 1.5, 1.2);
      return {
        gather: ss(0.36, 0.48, p),
        explode: ss(0.34, 0.46, p) * (1 - ss(0.56, 0.7, p)),
        internal: 0,
        flow: p * 26,
        flowVisible: 0,
        beam: 0,
        labels: ss(0.46, 0.5, p) * (1 - ss(0.54, 0.57, p)),
        xray: 0,
        ...cam,
      };
    }
  }
}

export function emptyState(): SceneState {
  return {
    gather: 1,
    explode: 0,
    internal: 0,
    flow: 0,
    flowVisible: 0,
    beam: 0,
    labels: 0,
    xray: 0,
    cam: [5, 2, 5],
    target: [0, 0, 0],
  };
}

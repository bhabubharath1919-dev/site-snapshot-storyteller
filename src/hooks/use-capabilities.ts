import { useEffect, useState } from "react";

export type Capabilities = {
  ready: boolean;
  reducedMotion: boolean;
  webgl: boolean;
  lowPower: boolean;
};

function detectWebgl() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Client-only capability detection; `ready` is false during SSR and the first paint. */
export function useCapabilities(): Capabilities {
  const [caps, setCaps] = useState<Capabilities>({
    ready: false,
    reducedMotion: false,
    webgl: true,
    lowPower: false,
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const nav = navigator as Navigator & { deviceMemory?: number };
    const lowPower =
      (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 2) ||
      (nav.deviceMemory !== undefined && nav.deviceMemory <= 2);
    const update = () =>
      setCaps({ ready: true, reducedMotion: mq.matches, webgl: detectWebgl(), lowPower });
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  return caps;
}

export function useInView<T extends Element>(ref: React.RefObject<T | null>, rootMargin = "0px") {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return inView;
}

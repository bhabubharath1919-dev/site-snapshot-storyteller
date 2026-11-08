import { useEffect, useRef, type RefObject } from "react";

/**
 * Tracks how far the user has scrolled through a tall element (0 at its top edge,
 * 1 when its bottom reaches the bottom of the viewport). Stored in a ref so the 3D
 * render loop can read it every frame without re-rendering React.
 */
export function useScrollProgress(
  target: RefObject<HTMLElement | null>,
  onChange?: (progress: number) => void,
) {
  const progress = useRef(0);
  const cb = useRef(onChange);
  cb.current = onChange;

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const el = target.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total <= 0 ? 0 : Math.min(1, Math.max(0, -rect.top / total));
      progress.current = p;
      cb.current?.(p);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [target]);

  return progress;
}

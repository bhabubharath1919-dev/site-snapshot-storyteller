import { lazy, Suspense, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import type { Product } from "@/lib/products";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { useCapabilities, useInView } from "@/hooks/use-capabilities";
import type { WindowVariant } from "@/components/three/SfiModel";
import { cn } from "@/lib/utils";

const ProductScene = lazy(() => import("@/components/three/ProductScene"));

export function SceneLoader({ label = "Initialising 3D scene" }: { label?: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="w-56">
        <div className="label-tech mb-3 text-center">{label}</div>
        <div className="relative h-px w-full overflow-hidden bg-foreground/15">
          <div className="loader-bar absolute inset-y-0 left-0 w-1/3 bg-highlight" />
        </div>
      </div>
    </div>
  );
}

/** Static storytelling for reduced-motion users and devices without WebGL. */
function StaticStory({ product }: { product: Product }) {
  return (
    <section className="mx-auto max-w-[1400px] px-5 pb-24 pt-28 md:px-10">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <div className="label-tech mb-4 text-highlight">{product.name}</div>
          <h1 className="display-lg">{product.headline}</h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">{product.subheadline}</p>
        </div>
        <figure>
          <img src={product.image} alt={`${product.fullName} concept render`} width={1024} height={1024} className="w-full" />
          <figcaption className="label-tech mt-2">Concept visualization</figcaption>
        </figure>
      </div>
      <ol className="mt-20 grid gap-px bg-border md:grid-cols-3">
        {product.chapters.slice(1).map((c, i) => (
          <li key={c.scene} className="bg-background p-8">
            <div className="label-tech text-highlight">Scene {String(i + 2).padStart(2, "0")} · {c.scene}</div>
            <h3 className="mt-3 text-2xl font-medium">{c.title}</h3>
            <p className="mt-2 text-muted-foreground">{c.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function CinematicStory({
  product,
  variant,
  heightVh = 720,
  controls,
}: {
  product: Product;
  variant?: WindowVariant;
  heightVh?: number;
  controls?: ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const caps = useCapabilities();
  const inView = useInView(sectionRef, "200px");

  const progress = useScrollProgress(sectionRef, (p) => {
    if (barRef.current) barRef.current.style.transform = `scaleY(${p})`;
    let idx = 0;
    product.chapters.forEach((c, i) => {
      if (p >= c.at) idx = i;
    });
    setActive((prev) => (prev === idx ? prev : idx));
  });

  if (caps.ready && (caps.reducedMotion || !caps.webgl)) return <StaticStory product={product} />;

  const chapters = product.chapters;
  const current = chapters[active];

  return (
    <section ref={sectionRef} className="relative" style={{ height: `${heightVh}vh` }} aria-label={`${product.fullName} animation`}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="stage-light absolute inset-0" />
        <div className="tech-grid absolute inset-0 opacity-40" />

        <div className="absolute inset-0">
          {caps.ready && (
            <Suspense fallback={null}>
              <ProductScene
                kind={product.slug}
                variant={variant}
                progress={progress}
                active={inView}
                lowPower={caps.lowPower}
                onReady={() => setReady(true)}
              />
            </Suspense>
          )}
          {!ready && <SceneLoader />}
        </div>
        <div className="vignette pointer-events-none absolute inset-0" />

        {/* Chapter copy */}
        <div className="pointer-events-none absolute inset-x-0 top-24 mx-auto max-w-[1600px] px-5 md:top-28 md:px-10">
          {chapters.map((c, i) => (
            <div key={c.scene} data-active={i === active} className={cn("chapter absolute left-5 right-5 md:left-10 md:right-auto md:max-w-2xl")}>
              <div className="label-tech mb-4 text-highlight">
                Scene {String(i + 1).padStart(2, "0")} — {c.scene}
              </div>
              {i === 0 ? (
                <h1 className="display-xl max-w-4xl">{c.title}</h1>
              ) : (
                <h2 className="display-lg max-w-3xl">{c.title}</h2>
              )}
              <p className="mt-5 max-w-md text-base text-muted-foreground md:text-lg">{c.body}</p>
              {c.labels && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {c.labels.map((l) => (
                    <span key={l} className="scene-label">{l}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Progress rail */}
        <div className="absolute bottom-10 right-5 top-28 hidden w-px bg-foreground/15 md:right-10 md:block">
          <div ref={barRef} className="h-full w-px origin-top bg-highlight" style={{ transform: "scaleY(0)" }} />
          {chapters.map((c) => (
            <span key={c.scene} className="absolute -left-[3px] size-[7px] border border-foreground/40 bg-background" style={{ top: `${c.at * 100}%` }} />
          ))}
        </div>

        <div className="absolute bottom-6 left-5 right-5 flex items-end justify-between gap-4 md:left-10 md:right-16">
          <div className="label-tech">
            <span className="text-foreground">{String(active + 1).padStart(2, "0")}</span> / {String(chapters.length).padStart(2, "0")} · {current?.scene}
            <div className="mt-1 text-[10px] opacity-70">Concept visualization</div>
          </div>
          {controls}
          <div className={cn("label-tech flex items-center gap-2 transition-opacity", active > 0 && "opacity-0")}>
            Scroll to explore <ChevronDown className="size-3 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}

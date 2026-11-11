import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { PRODUCTS } from "@/lib/products";
import { useCapabilities, useInView } from "@/hooks/use-capabilities";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/site/Marquee";
import { Reveal, SectionLabel } from "@/components/site/Reveal";
import { SceneLoader } from "@/components/product/CinematicStory";
import { cn } from "@/lib/utils";

const HeroScene = lazy(() => import("@/components/three/HeroScene"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SFI Engineering — Industrial Sight Flow Indicators" },
      {
        name: "description",
        content:
          "Precision-engineered Sight Flow Indicators for industrial process monitoring: rotor, flapper, full view and drip tube types.",
      },
      { property: "og:title", content: "SFI Engineering — See the flow. Understand the process." },
      {
        property: "og:description",
        content: "Precision-engineered Sight Flow Indicators for industrial process monitoring.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const PILLARS = [
  { n: "01", t: "Flow visibility", d: "Toughened viewing glass on both sides of the line, so operators confirm flow at a glance." },
  { n: "02", t: "Engineering precision", d: "Bodies sized to ASME B36.10M pipe dimensions with flange ratings per the specified standard." },
  { n: "03", t: "Industrial reliability", d: "Cast or forged pressure-retaining bodies, sealed with gaskets matched to the media." },
  { n: "04", t: "Material integrity", d: "Carbon steel, stainless steel and alloy options, selected for the process conditions." },
];

function Hero() {
  const caps = useCapabilities();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref);
  const [ready, setReady] = useState(false);
  const [offsetX, setOffsetX] = useState(0);

  useEffect(() => {
    const update = () => setOffsetX(window.innerWidth >= 1024 ? 1.35 : 0);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const use3d = caps.ready && caps.webgl && !caps.reducedMotion;
  const rotor = PRODUCTS[0]!;

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden">
      <div className="tech-grid absolute inset-0 opacity-60" aria-hidden />
      <div className="stage-light absolute inset-0" aria-hidden />

      <div className="absolute inset-x-0 top-10 h-[55svh] lg:inset-0 lg:h-auto" aria-hidden={!use3d}>
        {use3d ? (
          <>
            {!ready && <SceneLoader label="Loading 3D product" />}
            <Suspense fallback={null}>
              <HeroScene active={inView} offsetX={offsetX} lowPower={caps.lowPower} onReady={() => setReady(true)} />
            </Suspense>
          </>
        ) : caps.ready ? (
          <img
            src={rotor.image}
            alt="Carbon steel flanged sight flow indicator concept render"
            width={1024}
            height={1024}
            className="absolute right-0 top-1/2 w-full max-w-[720px] -translate-y-1/2 object-cover opacity-80 lg:right-10"
          />
        ) : null}
      </div>
      <div className="vignette pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/80 to-transparent lg:hidden" aria-hidden />

      <div className="pointer-events-none relative mx-auto flex min-h-[100svh] max-w-[1600px] flex-col justify-end px-5 pb-20 pt-28 md:px-10 lg:justify-center">
        <div className="pointer-events-auto max-w-3xl">
          <SectionLabel index="SFI">Sight Flow Indicators</SectionLabel>
          <h1 className="display-xl mt-6 text-metal-gradient">
            SEE THE FLOW.
            <br />
            UNDERSTAND THE PROCESS.
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">
            Precision-engineered Sight Flow Indicators for industrial process monitoring.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button variant="industrial" size="xl" asChild>
              <Link to="/products">
                Explore products <ArrowRight />
              </Link>
            </Button>
            <Button variant="technical" size="xl" asChild>
              <Link to="/technical-resources">View technical specifications</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="label-tech pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
        Scroll
        <ChevronDown className="size-4 animate-bounce text-highlight" />
      </div>
      <span className="label-tech absolute bottom-6 right-5 md:right-10">Concept visualization</span>
    </section>
  );
}

function Home() {
  return (
    <>
      <Hero />
      <Marquee />

      <section className="mx-auto max-w-[1600px] px-5 py-24 md:px-10">
        <Reveal>
          <SectionLabel index="01">Product range</SectionLabel>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <h2 className="display-lg max-w-3xl">Four ways to see inside the line.</h2>
            <Link to="/products" className="label-tech flex items-center gap-1 hover:text-highlight">
              View all types <ArrowUpRight className="size-3" />
            </Link>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.slug} delay={i * 80} className="bg-background">
              <Link to={p.path} className="group relative flex h-full flex-col p-5 transition-colors hover:bg-card">
                <div className="relative aspect-square overflow-hidden bg-surface">
                  <img
                    src={p.image}
                    alt={`${p.fullName} concept render`}
                    width={1024}
                    height={1024}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <span className="label-tech absolute left-3 top-3 text-highlight">{p.index}</span>
                </div>
                <div className="mt-5 flex flex-1 flex-col">
                  <h3 className="font-display text-xl font-medium">{p.name}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.short}</p>
                  <span className="label-tech mt-6 flex items-center gap-1 text-foreground group-hover:text-highlight">
                    Explore product <ArrowUpRight className="size-3" />
                  </span>
                </div>
                <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-highlight transition-transform duration-500 group-hover:scale-x-100" />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10">
          <Reveal>
            <SectionLabel index="02">Engineering</SectionLabel>
            <h2 className="display-lg mt-6 max-w-4xl">A pressure-retaining body with a window in it.</h2>
          </Reveal>
          <div className="mt-14 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p, i) => (
              <Reveal key={p.n} delay={i * 60} className="bg-surface p-8">
                <div className="label-tech text-highlight">{p.n}</div>
                <h3 className="mt-4 text-2xl font-medium">{p.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.d}</p>
              </Reveal>
            ))}
          </div>
          <Button variant="technical" size="xl" className="mt-10" asChild>
            <Link to="/engineering">
              How they're built <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-border">
        <div className="stage-light absolute inset-0" aria-hidden />
        <div className={cn("relative mx-auto max-w-[1600px] px-5 py-28 text-center md:px-10")}>
          <Reveal>
            <div className="label-tech">Request quotation</div>
            <h2 className="display-lg mx-auto mt-6 max-w-4xl">Tell us your line. We'll specify the indicator.</h2>
            <p className="mx-auto mt-6 max-w-xl text-muted-foreground">
              Share size, pressure class, material and media. Our engineers prepare a technical and commercial offer.
            </p>
            <Button variant="industrial" size="xl" className="mt-10" asChild>
              <Link to="/contact">
                Request technical &amp; commercial quotation <ArrowRight />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}

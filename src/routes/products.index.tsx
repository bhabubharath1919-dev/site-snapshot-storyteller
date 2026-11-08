import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PRODUCTS } from "@/lib/products";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Sight Flow Indicators — Rotor, Flapper, Full View, Drip Tube | SFI Engineering" },
      { name: "description", content: "Four sight flow indicator types, each with its own working principle: rotor, flapper, plain / full view and drip tube." },
      { property: "og:title", content: "Sight Flow Indicators — SFI Engineering" },
      { property: "og:description", content: "Engineered to make flow visible. Explore four sight flow indicator types in 3D." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  return (
    <>
      <PageHeader label="Products / Sight Flow Indicators" title="ENGINEERED TO MAKE FLOW VISIBLE.">
        Four working principles. Each one designed for a different way of seeing what happens inside the line.
      </PageHeader>
      {PRODUCTS.map((p, i) => (
        <section key={p.slug} className="border-b border-border">
          <div className={cn("mx-auto grid max-w-[1600px] items-center gap-10 px-5 py-20 md:grid-cols-2 md:px-10", i % 2 && "md:[&>*:first-child]:order-2")}>
            <Reveal>
              <Link to={p.path} className="group relative block overflow-hidden bg-surface">
                <img src={p.image} alt={`${p.fullName} concept render`} width={1024} height={1024} loading="lazy" className="aspect-square w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <span className="label-tech absolute bottom-4 left-4">Concept visualization</span>
              </Link>
            </Reveal>
            <Reveal delay={120}>
              <div className="label-tech text-highlight">{p.index} / 04</div>
              <h2 className="display-lg mt-4">{p.name}</h2>
              <p className="mt-6 max-w-lg text-lg text-muted-foreground">{p.description}</p>
              <dl className="mt-8 max-w-lg border-t border-border">
                <div className="border-b border-border py-4">
                  <dt className="label-tech">Working principle</dt>
                  <dd className="mt-1 text-sm">{p.principle}</dd>
                </div>
                <div className="border-b border-border py-4">
                  <dt className="label-tech">Installation</dt>
                  <dd className="mt-1 font-mono text-sm">{p.orientation}</dd>
                </div>
              </dl>
              <Button variant="industrial" size="xl" className="mt-8" asChild>
                <Link to={p.path}>Explore product <ArrowRight /></Link>
              </Button>
            </Reveal>
          </div>
        </section>
      ))}
    </>
  );
}

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PRODUCTS, type Product } from "@/lib/products";
import { defaultConfig, type SfiConfig } from "@/lib/configurator";
import type { WindowVariant } from "@/components/three/SfiModel";
import { CinematicStory } from "./CinematicStory";
import { SpecSheet } from "./SpecSheet";
import { Configurator } from "./Configurator";
import { RfqForm } from "./RfqForm";

const VARIANTS: { id: WindowVariant; label: string }[] = [
  { id: "single", label: "A · Single" },
  { id: "double", label: "B · Double" },
  { id: "full", label: "C · Full view" },
];

export function ProductPage({ product }: { product: Product }) {
  const [config, setConfig] = useState<SfiConfig>(() => defaultConfig(product.slug));
  const [version, setVersion] = useState(0);
  const [variant, setVariant] = useState<WindowVariant>("double");

  const controls =
    product.slug === "full-view" ? (
      <div className="pointer-events-auto flex gap-1 border border-border bg-background/80 p-1" role="radiogroup" aria-label="Viewing configuration">
        {VARIANTS.map((v) => (
          <button
            key={v.id}
            type="button"
            role="radio"
            aria-checked={variant === v.id}
            data-active={variant === v.id}
            onClick={() => {
              setVariant(v.id);
              setConfig((c) => ({ ...c, view: v.id }));
            }}
            className="px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground transition-colors data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
          >
            {v.label}
          </button>
        ))}
      </div>
    ) : null;

  const others = PRODUCTS.filter((p) => p.slug !== product.slug);

  return (
    <>
      <CinematicStory product={product} variant={product.slug === "full-view" ? variant : "double"} controls={controls} />
      <SpecSheet product={product} />
      <Configurator
        config={config}
        onChange={setConfig}
        onRequestQuote={() => {
          setVersion((v) => v + 1);
          document.getElementById("rfq")?.scrollIntoView({ behavior: "smooth" });
        }}
      />
      <RfqForm config={config} version={version} />
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-10">
          <div className="label-tech mb-6">Other sight flow indicators</div>
          <div className="grid gap-px bg-border md:grid-cols-3">
            {others.map((p) => (
              <Link key={p.slug} to={p.path} className="group flex items-center gap-5 bg-background p-5 transition-colors hover:bg-card">
                <img src={p.image} alt="" width={1024} height={1024} loading="lazy" className="size-20 object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="flex-1">
                  <div className="label-tech text-highlight">{p.index}</div>
                  <div className="font-display text-lg">{p.name}</div>
                </div>
                <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-highlight" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

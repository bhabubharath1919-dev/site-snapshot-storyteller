import type { Product } from "@/lib/products";
import {
  BODY_MATERIALS,
  END_CONNECTIONS,
  GASKET_MATERIALS,
  GLASS_MATERIALS,
  NB_SIZES,
  PRESSURE_CLASSES,
  UNVERIFIED,
  compatibleFlow,
  compatibleViews,
  nbToInch,
  pipeOdMm,
} from "@/lib/specs";
import { Reveal, SectionLabel } from "@/components/site/Reveal";

function Row({ k, v, muted }: { k: string; v: string; muted?: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-border py-4 sm:grid-cols-[220px_1fr] sm:gap-6">
      <dt className="label-tech pt-0.5">{k}</dt>
      <dd className={muted ? "font-mono text-sm text-muted-foreground" : "font-mono text-sm text-foreground"}>{v}</dd>
    </div>
  );
}

function Schematic() {
  return (
    <figure className="border border-border p-6">
      <svg viewBox="0 0 420 240" className="w-full text-metal" role="img" aria-label="Schematic showing dimensions A, B and C">
        <g fill="none" stroke="currentColor" strokeWidth="1.2">
          <rect x="40" y="70" width="18" height="110" />
          <rect x="362" y="70" width="18" height="110" />
          <rect x="58" y="105" width="90" height="40" />
          <rect x="272" y="105" width="90" height="40" />
          <circle cx="210" cy="125" r="66" />
          <circle cx="210" cy="125" r="42" className="text-highlight" stroke="currentColor" />
        </g>
        <g className="text-highlight" stroke="currentColor" strokeWidth="0.8" fill="currentColor" fontFamily="JetBrains Mono, monospace" fontSize="11">
          <line x1="40" y1="205" x2="380" y2="205" />
          <line x1="40" y1="198" x2="40" y2="212" />
          <line x1="380" y1="198" x2="380" y2="212" />
          <text x="204" y="225" stroke="none">A</text>
          <line x1="168" y1="40" x2="252" y2="40" />
          <line x1="168" y1="34" x2="168" y2="46" />
          <line x1="252" y1="34" x2="252" y2="46" />
          <text x="206" y="30" stroke="none">B</text>
          <line x1="300" y1="56" x2="300" y2="194" strokeDasharray="3 3" />
          <text x="306" y="62" stroke="none">C</text>
        </g>
      </svg>
      <figcaption className="label-tech mt-4">
        A face-to-face · B view size · C bolt length — schematic, not to scale, not a certified drawing
      </figcaption>
    </figure>
  );
}

export function SpecSheet({ product }: { product: Product }) {
  const views = compatibleViews(product.slug).map((v) => v.label).join(" · ");
  const flows = compatibleFlow(product.slug).map((f) => f.label).join(" · ");
  return (
    <section id="specifications" className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10">
        <Reveal>
          <SectionLabel index="06">Technical specifications</SectionLabel>
          <h2 className="display-lg mt-6 max-w-4xl">{product.fullName}</h2>
          <p className="mt-6 max-w-2xl text-muted-foreground">{product.principle}</p>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            <dl className="border-t border-border">
              <Row k="NB size range" v={`${NB_SIZES[0]} NB – ${NB_SIZES[NB_SIZES.length - 1]} NB`} />
              <Row k="Inch size" v={`${nbToInch(NB_SIZES[0]!)} – ${nbToInch(NB_SIZES[NB_SIZES.length - 1]!)}`} />
              <Row k="Pipe OD reference" v="Per ASME B36.10M — see table" />
              <Row k="Internal element" v={product.internal} />
              <Row k="View configurations" v={views} />
              <Row k="Installation" v={flows} />
              <Row k="View size (B)" v={UNVERIFIED} muted />
              <Row k="Face-to-face (A)" v={UNVERIFIED} muted />
              <Row k="Bolt length (C)" v={UNVERIFIED} muted />
              <Row k="Approximate weight" v={UNVERIFIED} muted />
              <Row k="Body material" v={BODY_MATERIALS.join(" · ")} />
              <Row k="Pressure class" v={PRESSURE_CLASSES.join(" · ")} />
              <Row k="Operating temperature" v="Limited by glass, gasket and pressure class — confirm with manufacturer." muted />
              <Row k="Glass material" v={GLASS_MATERIALS.join(" · ")} />
              <Row k="Gasket material" v={GASKET_MATERIALS.join(" · ")} />
              <Row k="Connection type" v={END_CONNECTIONS.join(" · ")} />
            </dl>
          </Reveal>
          <Reveal delay={150} className="space-y-8">
            <Schematic />
            <div className="border border-border">
              <div className="label-tech grid grid-cols-3 border-b border-border px-4 py-3">
                <span>NB</span>
                <span>Inch</span>
                <span className="text-right">Pipe OD (mm)</span>
              </div>
              {NB_SIZES.map((nb) => (
                <div key={nb} className="grid grid-cols-3 border-b border-border px-4 py-2 font-mono text-sm last:border-b-0">
                  <span>{nb}</span>
                  <span className="text-muted-foreground">{nbToInch(nb)}</span>
                  <span className="text-right">{pipeOdMm(nb).toFixed(1)}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

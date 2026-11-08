import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { BODY_MATERIALS, GASKET_MATERIALS, GLASS_MATERIALS, PRESSURE_CLASSES } from "@/lib/specs";

const BLOCKS = [
  { n: "01", t: "Body construction", d: "Cast or forged bodies, with custom welded construction where available. The body carries the pressure rating and end connections." },
  { n: "02", t: "Materials", d: BODY_MATERIALS.filter((m) => m !== "Others").join(" · ") },
  { n: "03", t: "Viewing glass", d: GLASS_MATERIALS.filter((m) => m !== "Others").join(" · ") },
  { n: "04", t: "Sealing", d: GASKET_MATERIALS.filter((m) => m !== "Others").join(" · ") },
  { n: "05", t: "Pressure classes", d: PRESSURE_CLASSES.join(" · ") },
  { n: "06", t: "Reference standards", d: "Pipe sizes and outside diameters referenced to ASME B36.10M. Flange ratings and dimensions per the specified standard, confirmed by the manufacturer." },
];

export const Route = createFileRoute("/engineering")({
  head: () => ({
    meta: [
      { title: "Engineering — Construction, Materials & Sealing | SFI Engineering" },
      { name: "description", content: "How our sight flow indicators are built: body construction, material options, toughened viewing glass, gaskets and pressure classes." },
      { property: "og:title", content: "Engineering — SFI Engineering" },
      { property: "og:description", content: "Construction, materials, glass and sealing behind every sight flow indicator." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <>
      <PageHeader label="Engineering" title="BUILT AROUND THE WINDOW.">
        Every sight flow indicator is a pressure-retaining assembly with a window in it. The engineering is in keeping
        both reliable.
      </PageHeader>
      <section className="mx-auto grid max-w-[1600px] gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
        {BLOCKS.map((b, i) => (
          <Reveal key={b.n} delay={i * 60} className="bg-background p-10">
            <div className="label-tech text-highlight">{b.n}</div>
            <h2 className="mt-4 text-3xl font-medium">{b.t}</h2>
            <p className="mt-4 font-mono text-sm leading-relaxed text-muted-foreground">{b.d}</p>
          </Reveal>
        ))}
      </section>
    </>
  ),
});

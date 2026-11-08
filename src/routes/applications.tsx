import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { PRODUCTS } from "@/lib/products";

const INDUSTRIES = ["Chemical & petrochemical", "Oil & gas", "Pharmaceutical", "Power generation", "Water & wastewater", "Food & beverage", "Pulp & paper", "HVAC & utilities"];

const GUIDE: Record<string, string> = {
  rotor: "Clear or low-contrast liquids where you need a positive sign that flow is moving.",
  flapper: "Confirming flow presence and direction in horizontal lines or vertical upward flow.",
  "full-view": "Observing colour, clarity, turbidity or bubbles directly through the glass.",
  "drip-tube": "Very low or intermittent flow in vertical downward lines.",
};

export const Route = createFileRoute("/applications")({
  head: () => ({
    meta: [
      { title: "Applications — Where Sight Flow Indicators Work | SFI Engineering" },
      { name: "description", content: "Industries and process duties for sight flow indicators, with a guide to choosing rotor, flapper, full view or drip tube types." },
      { property: "og:title", content: "Applications — SFI Engineering" },
      { property: "og:description", content: "Choose the right sight flow indicator for your process." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <>
      <PageHeader label="Applications" title="WHEREVER FLOW MUST BE SEEN.">
        From cooling water to process chemicals — visual confirmation of flow at the point of use.
      </PageHeader>
      <section className="mx-auto max-w-[1600px] px-5 py-20 md:px-10">
        <div className="label-tech mb-8">Industries</div>
        <ul className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {INDUSTRIES.map((x) => (
            <li key={x} className="bg-background p-8 font-display text-xl">{x}</li>
          ))}
        </ul>
        <div className="label-tech mb-8 mt-20">Selection guide</div>
        <div className="border-t border-border">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.slug} delay={i * 60}>
              <Link to={p.path} className="group grid gap-4 border-b border-border py-8 md:grid-cols-[80px_1fr_1.4fr] md:items-center">
                <span className="label-tech text-highlight">{p.index}</span>
                <span className="font-display text-3xl group-hover:text-highlight">{p.name}</span>
                <span className="text-muted-foreground">{GUIDE[p.slug]}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  ),
});

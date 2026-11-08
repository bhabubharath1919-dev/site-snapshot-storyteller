import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { SpecTable } from "@/components/product/SpecTable";

export const Route = createFileRoute("/technical-resources")({
  head: () => ({
    meta: [
      { title: "Technical Resources & Dimension Table — SFI Engineering" },
      { name: "description", content: "Searchable sight flow indicator specification table: NB, inch, pipe OD, pressure class and materials, with datasheet download." },
      { property: "og:title", content: "Technical Resources — SFI Engineering" },
      { property: "og:description", content: "Search and filter sight flow indicator specifications and download the datasheet." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <>
      <PageHeader label="Technical resources" title="THE DATA BEHIND THE GLASS.">
        Filter by type, size, pressure class and material. Product-specific dimensions are issued from verified
        manufacturer data only.
      </PageHeader>
      <section className="mx-auto max-w-[1600px] px-5 py-16 md:px-10">
        <SpecTable />
      </section>
    </>
  ),
});

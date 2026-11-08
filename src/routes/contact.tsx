import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { RfqForm } from "@/components/product/RfqForm";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Request a Quotation — SFI Engineering" },
      { name: "description", content: "Request a technical and commercial quotation for sight flow indicators. Share size, pressure class, material and process data." },
      { property: "og:title", content: "Request a Quotation — SFI Engineering" },
      { property: "og:description", content: "Send your sight flow indicator requirements for a technical and commercial quotation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <>
      <PageHeader label="Contact" title="TELL US ABOUT YOUR LINE.">
        Size, pressure class, materials and media — we'll come back with a technical and commercial offer.
      </PageHeader>
      <RfqForm index="01" />
    </>
  ),
});

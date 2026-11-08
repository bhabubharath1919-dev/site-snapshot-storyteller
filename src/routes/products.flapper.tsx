import { createFileRoute } from "@tanstack/react-router";
import { ProductPage } from "@/components/product/ProductPage";
import { getProduct } from "@/lib/products";

const product = getProduct("flapper");

export const Route = createFileRoute("/products/flapper")({
  head: () => ({
    meta: [
      { title: "Flapper Type Sight Flow Indicator — SFI Engineering" },
      { name: "description", content: "Hinged flapper sight flow indicator: scroll-linked flow deflection, exploded view, working principle, specifications and RFQ." },
      { property: "og:title", content: "Flapper Type Sight Flow Indicator — SFI Engineering" },
      { property: "og:description", content: "Flow, made visible. Interactive 3D flapper type SFI with configurator and quotation request." },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ProductPage product={product} />,
});

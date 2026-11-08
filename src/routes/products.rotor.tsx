import { createFileRoute } from "@tanstack/react-router";
import { ProductPage } from "@/components/product/ProductPage";
import { getProduct } from "@/lib/products";

const product = getProduct("rotor");

export const Route = createFileRoute("/products/rotor")({
  head: () => ({
    meta: [
      { title: "Rotor Type Sight Flow Indicator — SFI Engineering" },
      { name: "description", content: "Explore the rotor / rotary sight flow indicator: scroll-driven 3D rotor, exploded view, specifications, configurator and RFQ." },
      { property: "og:title", content: "Rotor Type Sight Flow Indicator — SFI Engineering" },
      { property: "og:description", content: "Rotation reveals the flow. Interactive 3D rotor type SFI with specifications and quotation request." },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ProductPage product={product} />,
});

import { createFileRoute } from "@tanstack/react-router";
import { ProductPage } from "@/components/product/ProductPage";
import { getProduct } from "@/lib/products";

const product = getProduct("drip-tube");

export const Route = createFileRoute("/products/drip-tube")({
  head: () => ({
    meta: [
      { title: "Drip Tube Sight Flow Indicator — SFI Engineering" },
      { name: "description", content: "Drip tube sight flow indicator for low-volume flow: gravity-driven droplet animation, exploded view, vertical installation and RFQ." },
      { property: "og:title", content: "Drip Tube Sight Flow Indicator — SFI Engineering" },
      { property: "og:description", content: "Every drop tells a story. Interactive 3D drip tube SFI with specifications and quotation request." },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ProductPage product={product} />,
});

import { createFileRoute } from "@tanstack/react-router";
import { ProductPage } from "@/components/product/ProductPage";
import { getProduct } from "@/lib/products";

const product = getProduct("full-view");

export const Route = createFileRoute("/products/full-view")({
  head: () => ({
    meta: [
      { title: "Plain / Full View Sight Flow Indicator — SFI Engineering" },
      { name: "description", content: "Single, double and full view sight flow indicators: interactive 3D windows, bi-directional light, cutaway view and specifications." },
      { property: "og:title", content: "Plain / Full View Sight Flow Indicator — SFI Engineering" },
      { property: "og:description", content: "Clarity through every window. Explore single, double and full view configurations in 3D." },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ProductPage product={product} />,
});

import rotorImg from "@/assets/sfi-rotor.jpg";
import flapperImg from "@/assets/sfi-flapper.jpg";
import fullViewImg from "@/assets/sfi-fullview.jpg";
import dripImg from "@/assets/sfi-driptube.jpg";
import type { ProductSlug } from "./specs";

export type Chapter = {
  /** scroll progress where this chapter becomes active (0..1) */
  at: number;
  scene: string;
  title: string;
  body: string;
  labels?: string[];
};

export type Product = {
  slug: ProductSlug;
  path: "/products/rotor" | "/products/flapper" | "/products/full-view" | "/products/drip-tube";
  index: string;
  name: string;
  fullName: string;
  short: string;
  description: string;
  principle: string;
  headline: string;
  subheadline: string;
  image: string;
  internal: string;
  orientation: string;
  chapters: Chapter[];
};

export const PRODUCTS: Product[] = [
  {
    slug: "rotor",
    path: "/products/rotor",
    index: "01",
    name: "Rotor / Rotary Type",
    fullName: "Rotor Type Sight Flow Indicator",
    short: "Rotating impeller gives an instant visual response to flow.",
    description:
      "A free-spinning rotor mounted between opposing sight glasses turns whenever fluid passes, making even low-contrast or clear media visibly in motion.",
    principle:
      "Moving fluid strikes the rotor blades and turns the impeller on its shaft. Rotation confirms flow; a stationary rotor signals no flow.",
    headline: "ROTATION REVEALS THE FLOW.",
    subheadline: "A visible response to fluid movement.",
    image: rotorImg,
    internal: "Rotor / impeller on support shaft",
    orientation: "Horizontal or vertical lines, per manufacturer design",
    chapters: [
      {
        at: 0,
        scene: "Rotor reveal",
        title: "ROTATION REVEALS THE FLOW.",
        body: "A visible response to fluid movement.",
        labels: ["ROTOR", "IMPELLER", "FLOW RESPONSE"],
      },
      {
        at: 0.16,
        scene: "Rotor rotation",
        title: "Scroll is the flow.",
        body: "Your scroll drives the rotor. Stop and it holds. Reverse and it unwinds — exactly as the impeller answers the medium.",
      },
      {
        at: 0.38,
        scene: "Exploded view",
        title: "Eight parts. One alignment.",
        body: "Rotor, shaft, glasses, gaskets, cover plates, body and fasteners — each on its own axis, each in its correct relative position.",
      },
      {
        at: 0.6,
        scene: "Component assembly",
        title: "Sealed into the body.",
        body: "Windows seat against their gaskets, cover plates close and fasteners draw the assembly tight while the rotor keeps turning.",
      },
      {
        at: 0.8,
        scene: "Final product",
        title: "ROTOR TYPE SIGHT FLOW INDICATOR",
        body: "Front, side and perspective — the complete inline assembly, ready for the line.",
      },
    ],
  },
  {
    slug: "flapper",
    path: "/products/flapper",
    index: "02",
    name: "Flapper Type",
    fullName: "Flapper Type Sight Flow Indicator",
    short: "Hinged flapper deflects in the direction of flow.",
    description:
      "A hinged flapper hangs in the flow path behind the sight glass. Flow pushes it open; the deflection angle gives a clear visual of flow presence and direction.",
    principle:
      "The flapper pivots on a hinge pin. Fluid momentum deflects it downstream; when flow stops, gravity returns it to the neutral position.",
    headline: "FLOW, MADE VISIBLE.",
    subheadline: "Deflection you can read from across the plant.",
    image: flapperImg,
    internal: "Hinged flapper on pivot pin",
    orientation: "Horizontal piping, or vertical piping with upward flow",
    chapters: [
      {
        at: 0,
        scene: "Flapper",
        title: "FLOW, MADE VISIBLE.",
        body: "A hinged flapper, held in its neutral state.",
        labels: ["FLAPPER", "HINGE PIN", "NEUTRAL"],
      },
      {
        at: 0.16,
        scene: "Flow response",
        title: "Momentum, read as an angle.",
        body: "As flow enters the chamber the flapper swings downstream. Scroll controls the flow — the flapper follows.",
      },
      {
        at: 0.4,
        scene: "Exploded view",
        title: "Seven components.",
        body: "Flapper, hinge pin, viewing glasses, gaskets, cover plates, body and fasteners separated along their axes.",
      },
      {
        at: 0.6,
        scene: "Assembly",
        title: "Back on its pivot.",
        body: "The flapper returns to its mounting, glass slides into place and the cover plate closes.",
      },
      {
        at: 0.76,
        scene: "Working principle",
        title: "Deflects with the flow.",
        body: "Suitable for horizontal piping and vertical piping with upward flow, as specified by the selected product design.",
      },
      {
        at: 0.9,
        scene: "Final product",
        title: "FLAPPER TYPE SIGHT FLOW INDICATOR",
        body: "Complete assembly, orbit view.",
      },
    ],
  },
  {
    slug: "full-view",
    path: "/products/full-view",
    index: "03",
    name: "Plain / Full View Type",
    fullName: "Plain / Full View Sight Flow Indicator",
    short: "Unobstructed windows for direct observation of the media.",
    description:
      "No internal moving parts — just a clear chamber behind toughened glass. Ideal for observing colour, clarity, turbidity and the presence of liquid.",
    principle:
      "Direct observation. With opposing windows, light passes through the chamber so the media can be viewed against a back-lit field from either side.",
    headline: "CLARITY THROUGH EVERY WINDOW.",
    subheadline: "Single, double or full view — nothing between you and the process.",
    image: fullViewImg,
    internal: "No internal element — clear flow chamber",
    orientation: "Horizontal or vertical lines, per manufacturer design",
    chapters: [
      {
        at: 0,
        scene: "The window",
        title: "CLARITY THROUGH EVERY WINDOW.",
        body: "A metallic body, a bolted cover plate and toughened glass.",
        labels: ["VIEW GLASS", "COVER PLATE", "BODY"],
      },
      {
        at: 0.16,
        scene: "Into the glass",
        title: "See the media itself.",
        body: "Colour, clarity, bubbles and flow — observed directly through the viewing glass.",
      },
      {
        at: 0.36,
        scene: "Exploded view",
        title: "Glass. Gasket. Plate.",
        body: "Front glass, rear glass on double-window designs, gaskets, cover plates, body and fasteners.",
      },
      {
        at: 0.56,
        scene: "Assembly",
        title: "Assembled to configuration.",
        body: "Each configuration assembles with its own supported window arrangement.",
      },
      {
        at: 0.72,
        scene: "Bi-directional view",
        title: "Light from both sides.",
        body: "Opposing windows let light pass straight through the chamber for observation from either side.",
      },
      {
        at: 0.86,
        scene: "Views",
        title: "Front. Rear. Side. Cutaway.",
        body: "The complete Plain / Full View Sight Flow Indicator.",
      },
    ],
  },
  {
    slug: "drip-tube",
    path: "/products/drip-tube",
    index: "04",
    name: "Drip Tube Type",
    fullName: "Drip Tube Sight Flow Indicator",
    short: "Makes intermittent, low-volume flow visible drop by drop.",
    description:
      "An internal drip tube forms individual droplets that fall through the sight chamber — the clearest way to confirm very low or intermittent flow.",
    principle:
      "Media enters through the drip tube and detaches as droplets that fall under gravity past the windows. Vertical installation with downward flow.",
    headline: "EVERY DROP TELLS A STORY.",
    subheadline: "Low-volume flow, made unmistakable.",
    image: dripImg,
    internal: "Drip tube in central chamber",
    orientation: "Vertical installation — downward flow",
    chapters: [
      {
        at: 0,
        scene: "Drip tube",
        title: "EVERY DROP TELLS A STORY.",
        body: "A vertical drip tube at the heart of the chamber.",
        labels: ["DRIP TUBE", "VERTICAL", "LOW FLOW"],
      },
      {
        at: 0.16,
        scene: "Droplets",
        title: "Gravity does the talking.",
        body: "Droplets form at the tip, detach and accelerate downward — intermittent low-volume flow, made visible.",
      },
      {
        at: 0.38,
        scene: "Exploded view",
        title: "Every seal accounted for.",
        body: "Drip tube, viewing glasses, gaskets, cover plates, body and fasteners.",
      },
      {
        at: 0.58,
        scene: "Assembly",
        title: "Into the chamber.",
        body: "The drip tube slides into the central chamber, glasses and seals align, the body closes.",
      },
      {
        at: 0.76,
        scene: "Complete",
        title: "VERTICAL INSTALLATION — DOWNWARD FLOW",
        body: "Subject to manufacturer-approved configuration.",
      },
    ],
  },
];

export function getProduct(slug: ProductSlug): Product {
  const p = PRODUCTS.find((x) => x.slug === slug);
  if (!p) throw new Error(`Unknown product ${slug}`);
  return p;
}

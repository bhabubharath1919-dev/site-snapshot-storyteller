/**
 * Technical data model for Sight Flow Indicators.
 *
 * Only values that come from published standards are hard-coded here:
 *  - NB → nominal inch size (ASME B36.10M / ISO 6708 nominal designations)
 *  - Pipe OD reference in mm (ASME B36.10M outside diameters)
 *
 * Product-specific dimensions (face-to-face A, view size B, bolt length C, weight)
 * MUST come from the manufacturer's verified data sheet. Add them to
 * VERIFIED_DIMENSIONS below; anything missing renders "Contact manufacturer for confirmation."
 */

export type ProductSlug = "rotor" | "flapper" | "full-view" | "drip-tube";

export const UNVERIFIED = "Contact manufacturer for confirmation.";

export const NB_SIZES = [15, 20, 25, 40, 50, 65, 80, 100, 150, 200, 250, 300, 350, 400] as const;
export type NbSize = (typeof NB_SIZES)[number];

const NB_TABLE: Record<NbSize, { inch: string; odMm: number }> = {
  15: { inch: '1/2"', odMm: 21.3 },
  20: { inch: '3/4"', odMm: 26.7 },
  25: { inch: '1"', odMm: 33.4 },
  40: { inch: '1-1/2"', odMm: 48.3 },
  50: { inch: '2"', odMm: 60.3 },
  65: { inch: '2-1/2"', odMm: 73.0 },
  80: { inch: '3"', odMm: 88.9 },
  100: { inch: '4"', odMm: 114.3 },
  150: { inch: '6"', odMm: 168.3 },
  200: { inch: '8"', odMm: 219.1 },
  250: { inch: '10"', odMm: 273.0 },
  300: { inch: '12"', odMm: 323.8 },
  350: { inch: '14"', odMm: 355.6 },
  400: { inch: '16"', odMm: 406.4 },
};

export function nbToInch(nb: NbSize): string {
  return NB_TABLE[nb].inch;
}

export function pipeOdMm(nb: NbSize): number {
  return NB_TABLE[nb].odMm;
}

export const VIEW_CONFIGS = [
  { id: "single", label: "Single Window" },
  { id: "double", label: "Double Window" },
  { id: "full", label: "Full View / Bi-directional" },
  { id: "custom", label: "Manufacturer-specific custom option" },
] as const;
export type ViewConfigId = (typeof VIEW_CONFIGS)[number]["id"];

/** Viewing configurations offered per product type (subject to manufacturer confirmation). */
export const COMPATIBLE_VIEWS: Record<ProductSlug, ViewConfigId[]> = {
  rotor: ["single", "double", "custom"],
  flapper: ["single", "double", "custom"],
  "full-view": ["single", "double", "full", "custom"],
  "drip-tube": ["double", "full", "custom"],
};

export function compatibleViews(product: ProductSlug) {
  return VIEW_CONFIGS.filter((v) => COMPATIBLE_VIEWS[product].includes(v.id));
}

export const FLOW_DIRECTIONS = [
  { id: "horizontal", label: "Horizontal" },
  { id: "vertical-up", label: "Vertical — upward flow" },
  { id: "vertical-down", label: "Vertical — downward flow" },
] as const;
export type FlowDirectionId = (typeof FLOW_DIRECTIONS)[number]["id"];

/** Installation orientations supported by each working principle. */
export const COMPATIBLE_FLOW: Record<ProductSlug, FlowDirectionId[]> = {
  rotor: ["horizontal", "vertical-up", "vertical-down"],
  flapper: ["horizontal", "vertical-up"],
  "full-view": ["horizontal", "vertical-up", "vertical-down"],
  "drip-tube": ["vertical-down"],
};

export function compatibleFlow(product: ProductSlug) {
  return FLOW_DIRECTIONS.filter((f) => COMPATIBLE_FLOW[product].includes(f.id));
}

export const PRESSURE_CLASSES = [
  "ASME Class 150",
  "ASME Class 300",
  "PN16",
  "PN40",
  "Other / Enquiry",
] as const;
export type PressureClass = (typeof PRESSURE_CLASSES)[number];

export const BODY_MATERIALS = [
  "Carbon Steel",
  "SS304",
  "SS316",
  "SS316L",
  "Duplex Stainless Steel",
  "Alloy Steel",
  "Inconel 625",
  "Inconel 825",
  "Monel",
  "Hastelloy",
  "Others",
] as const;

export const BODY_CONSTRUCTION = ["Cast", "Forged", "Custom / Welded, if available"] as const;
export const COVER_CONSTRUCTION = ["Cast", "Forged"] as const;

export const COVER_MATERIALS = [
  "Carbon Steel",
  "SS304",
  "SS316",
  "SS316L",
  "Inconel 625",
  "Inconel 825",
  "Hastelloy",
  "Others",
] as const;

export const GLASS_MATERIALS = [
  "Toughened Borosilicate Glass",
  "Toughened Soda Lime Glass",
  "Quartz, if available",
  "Mica Protected, if available",
  "Others",
] as const;

export const GASKET_MATERIALS = [
  "PTFE / Teflon",
  "Graphite",
  "Spiral Wound Graphite Style R",
  "Silicone",
  "Others",
] as const;

export const END_CONNECTIONS = [
  "Flanged",
  "NPT Threaded",
  "BSP Threaded",
  "Socket Weld",
  "Others",
] as const;
export type EndConnection = (typeof END_CONNECTIONS)[number];

export const FLANGE_FACES = ["RF", "FF", "Other manufacturer-approved face"] as const;

export type Dimensions = {
  faceToFaceA: number;
  viewSizeB: number;
  boltLengthC: number;
  weightKg: number;
};

/**
 * Manufacturer-verified dimensions. Key format: `${product}|${view}|${nb}|${pressureClass}`.
 * Intentionally empty until verified manufacturer data is supplied — never invent values here.
 */
export const VERIFIED_DIMENSIONS: Record<string, Dimensions> = {};

export function dimensionKey(
  product: ProductSlug,
  view: ViewConfigId,
  nb: NbSize,
  pressure: PressureClass,
) {
  return `${product}|${view}|${nb}|${pressure}`;
}

export function lookupDimensions(
  product: ProductSlug,
  view: ViewConfigId,
  nb: NbSize,
  pressure: PressureClass,
  source: Record<string, Dimensions> = VERIFIED_DIMENSIONS,
): Dimensions | null {
  return source[dimensionKey(product, view, nb, pressure)] ?? null;
}

export function needsFlangeFace(connection: EndConnection) {
  return connection === "Flanged";
}

export const PRODUCT_LABEL: Record<ProductSlug, string> = {
  rotor: "Rotor / Rotary",
  flapper: "Flapper",
  "full-view": "Plain / Full View",
  "drip-tube": "Drip Tube",
};

export type SpecRow = {
  product: ProductSlug;
  view: ViewConfigId;
  nb: NbSize;
  inch: string;
  odMm: number;
  pressure: PressureClass;
  dims: Dimensions | null;
  bodyMaterials: readonly string[];
  glass: readonly string[];
  connections: readonly string[];
};

/** Rows for the technical table: every product × default view × NB × rated pressure class. */
export function buildSpecRows(source: Record<string, Dimensions> = VERIFIED_DIMENSIONS): SpecRow[] {
  const rows: SpecRow[] = [];
  const pressures = PRESSURE_CLASSES.filter((p) => p !== "Other / Enquiry");
  (Object.keys(COMPATIBLE_VIEWS) as ProductSlug[]).forEach((product) => {
    const views = COMPATIBLE_VIEWS[product].filter((v) => v !== "custom");
    views.forEach((view) => {
      NB_SIZES.forEach((nb) => {
        pressures.forEach((pressure) => {
          rows.push({
            product,
            view,
            nb,
            inch: nbToInch(nb),
            odMm: pipeOdMm(nb),
            pressure,
            dims: lookupDimensions(product, view, nb, pressure, source),
            bodyMaterials: BODY_MATERIALS.filter((m) => m !== "Others"),
            glass: GLASS_MATERIALS.filter((g) => g !== "Others"),
            connections: END_CONNECTIONS.filter((c) => c !== "Others"),
          });
        });
      });
    });
  });
  return rows;
}

export function viewLabel(id: ViewConfigId) {
  return VIEW_CONFIGS.find((v) => v.id === id)?.label ?? id;
}

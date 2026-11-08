import {
  BODY_CONSTRUCTION,
  BODY_MATERIALS,
  COVER_CONSTRUCTION,
  COVER_MATERIALS,
  END_CONNECTIONS,
  FLANGE_FACES,
  GASKET_MATERIALS,
  GLASS_MATERIALS,
  PRESSURE_CLASSES,
  PRODUCT_LABEL,
  COMPATIBLE_FLOW,
  COMPATIBLE_VIEWS,
  FLOW_DIRECTIONS,
  UNVERIFIED,
  lookupDimensions,
  nbToInch,
  needsFlangeFace,
  pipeOdMm,
  viewLabel,
  type EndConnection,
  type FlowDirectionId,
  type NbSize,
  type PressureClass,
  type ProductSlug,
  type ViewConfigId,
} from "./specs";

export type SfiConfig = {
  product: ProductSlug;
  view: ViewConfigId;
  nb: NbSize;
  pressure: PressureClass;
  bodyMaterial: (typeof BODY_MATERIALS)[number];
  bodyConstruction: (typeof BODY_CONSTRUCTION)[number];
  coverConstruction: (typeof COVER_CONSTRUCTION)[number];
  coverMaterial: (typeof COVER_MATERIALS)[number];
  glass: (typeof GLASS_MATERIALS)[number];
  gasket: (typeof GASKET_MATERIALS)[number];
  endConnection: EndConnection;
  flangeFace: (typeof FLANGE_FACES)[number];
  flowDirection: FlowDirectionId;
  fluid: string;
  operatingPressure: string;
  designPressure: string;
  operatingTemperature: string;
  designTemperature: string;
  quantity: number;
};

export function defaultConfig(product: ProductSlug): SfiConfig {
  return {
    product,
    view: COMPATIBLE_VIEWS[product][product === "full-view" ? 2 : 1] ?? COMPATIBLE_VIEWS[product][0]!,
    nb: 50,
    pressure: PRESSURE_CLASSES[0],
    bodyMaterial: "Carbon Steel",
    bodyConstruction: "Cast",
    coverConstruction: "Cast",
    coverMaterial: "Carbon Steel",
    glass: "Toughened Borosilicate Glass",
    gasket: "PTFE / Teflon",
    endConnection: "Flanged",
    flangeFace: "RF",
    flowDirection: COMPATIBLE_FLOW[product][0]!,
    fluid: "",
    operatingPressure: "",
    designPressure: "",
    operatingTemperature: "",
    designTemperature: "",
    quantity: 1,
  };
}

/** Switching product keeps user choices but drops any view / orientation the new type does not support. */
export function withProduct(config: SfiConfig, product: ProductSlug): SfiConfig {
  const fallback = defaultConfig(product);
  return {
    ...config,
    product,
    view: COMPATIBLE_VIEWS[product].includes(config.view) ? config.view : fallback.view,
    flowDirection: COMPATIBLE_FLOW[product].includes(config.flowDirection)
      ? config.flowDirection
      : fallback.flowDirection,
  };
}

export function configDimensions(config: SfiConfig) {
  const d = lookupDimensions(config.product, config.view, config.nb, config.pressure);
  const f = (v: number | undefined, unit: string) => (v === undefined ? UNVERIFIED : `${v} ${unit}`);
  return {
    faceToFaceA: f(d?.faceToFaceA, "mm"),
    viewSizeB: f(d?.viewSizeB, "mm"),
    boltLengthC: f(d?.boltLengthC, "mm"),
    weight: f(d?.weightKg, "kg"),
  };
}

export function configSummary(config: SfiConfig): Record<string, string> {
  const dims = configDimensions(config);
  const out: Record<string, string> = {
    "Product type": PRODUCT_LABEL[config.product],
    "View configuration": viewLabel(config.view),
    Size: `${config.nb} NB (${nbToInch(config.nb)})`,
    "Pipe OD reference": `${pipeOdMm(config.nb).toFixed(1)} mm`,
    "Pressure class": config.pressure,
    "Body material": config.bodyMaterial,
    "Body construction": config.bodyConstruction,
    "Cover plate": `${config.coverConstruction} · ${config.coverMaterial}`,
    "View glass": config.glass,
    "Gasket / seal": config.gasket,
    "End connection": config.endConnection,
  };
  if (needsFlangeFace(config.endConnection)) out["Flange face"] = config.flangeFace;
  out["Flow direction"] = FLOW_DIRECTIONS.find((f) => f.id === config.flowDirection)?.label ?? config.flowDirection;
  out["Face-to-face A"] = dims.faceToFaceA;
  out["View size B"] = dims.viewSizeB;
  out["Bolt length C"] = dims.boltLengthC;
  out["Approx. weight"] = dims.weight;
  if (config.fluid) out["Fluid / media"] = config.fluid;
  if (config.operatingPressure) out["Operating pressure"] = config.operatingPressure;
  if (config.designPressure) out["Design pressure"] = config.designPressure;
  if (config.operatingTemperature) out["Operating temperature"] = config.operatingTemperature;
  if (config.designTemperature) out["Design temperature"] = config.designTemperature;
  out.Quantity = String(config.quantity);
  return out;
}

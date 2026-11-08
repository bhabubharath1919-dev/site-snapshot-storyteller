import { ArrowRight } from "lucide-react";
import {
  BODY_CONSTRUCTION,
  BODY_MATERIALS,
  COVER_CONSTRUCTION,
  COVER_MATERIALS,
  END_CONNECTIONS,
  FLANGE_FACES,
  GASKET_MATERIALS,
  GLASS_MATERIALS,
  NB_SIZES,
  PRESSURE_CLASSES,
  PRODUCT_LABEL,
  compatibleFlow,
  compatibleViews,
  nbToInch,
  needsFlangeFace,
  type ProductSlug,
} from "@/lib/specs";
import { configSummary, withProduct, type SfiConfig } from "@/lib/configurator";
import { Button } from "@/components/ui/button";
import { Reveal, SectionLabel } from "@/components/site/Reveal";
import { ChipGroup, Field, SelectInput, TextInput } from "./fields";

const opts = <T extends string>(list: readonly T[]) => list.map((v) => ({ value: v, label: v }));

export function Configurator({
  config,
  onChange,
  onRequestQuote,
}: {
  config: SfiConfig;
  onChange: (c: SfiConfig) => void;
  onRequestQuote: () => void;
}) {
  const set = <K extends keyof SfiConfig>(k: K, v: SfiConfig[K]) => onChange({ ...config, [k]: v });
  const summary = configSummary(config);

  return (
    <section id="configure" className="border-t border-border">
      <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10">
        <Reveal>
          <SectionLabel index="07">Product configuration</SectionLabel>
          <h2 className="display-lg mt-6 max-w-4xl">Configure your indicator.</h2>
          <p className="mt-6 max-w-2xl text-muted-foreground">
            Only variants compatible with the selected product are shown. Dimensions appear when verified manufacturer
            data exists for the exact configuration.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-10">
            <ChipGroup
              label="Product type"
              value={config.product}
              onChange={(p: ProductSlug) => onChange(withProduct(config, p))}
              options={(Object.keys(PRODUCT_LABEL) as ProductSlug[]).map((p) => ({ value: p, label: PRODUCT_LABEL[p] }))}
            />
            <ChipGroup
              label="View configuration"
              value={config.view}
              onChange={(v) => set("view", v)}
              options={compatibleViews(config.product).map((v) => ({ value: v.id, label: v.label }))}
            />
            <div>
              <ChipGroup
                label="Size (NB)"
                value={config.nb}
                onChange={(v) => set("nb", v)}
                options={NB_SIZES.map((n) => ({ value: n, label: `${n}` }))}
              />
              <div className="mt-3 font-mono text-sm text-muted-foreground">
                Nominal inch size: <span className="text-highlight">{nbToInch(config.nb)}</span>
              </div>
            </div>
            <ChipGroup label="Pressure class" value={config.pressure} onChange={(v) => set("pressure", v)} options={opts(PRESSURE_CLASSES)} />

            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Body material">
                <SelectInput value={config.bodyMaterial} onChange={(e) => set("bodyMaterial", e.target.value as SfiConfig["bodyMaterial"])}>
                  {BODY_MATERIALS.map((m) => <option key={m}>{m}</option>)}
                </SelectInput>
              </Field>
              <Field label="Body construction">
                <SelectInput value={config.bodyConstruction} onChange={(e) => set("bodyConstruction", e.target.value as SfiConfig["bodyConstruction"])}>
                  {BODY_CONSTRUCTION.map((m) => <option key={m}>{m}</option>)}
                </SelectInput>
              </Field>
              <Field label="Cover plate">
                <SelectInput value={config.coverConstruction} onChange={(e) => set("coverConstruction", e.target.value as SfiConfig["coverConstruction"])}>
                  {COVER_CONSTRUCTION.map((m) => <option key={m}>{m}</option>)}
                </SelectInput>
              </Field>
              <Field label="Cover plate material">
                <SelectInput value={config.coverMaterial} onChange={(e) => set("coverMaterial", e.target.value as SfiConfig["coverMaterial"])}>
                  {COVER_MATERIALS.map((m) => <option key={m}>{m}</option>)}
                </SelectInput>
              </Field>
              <Field label="View glass">
                <SelectInput value={config.glass} onChange={(e) => set("glass", e.target.value as SfiConfig["glass"])}>
                  {GLASS_MATERIALS.map((m) => <option key={m}>{m}</option>)}
                </SelectInput>
              </Field>
              <Field label="Gasket / seal">
                <SelectInput value={config.gasket} onChange={(e) => set("gasket", e.target.value as SfiConfig["gasket"])}>
                  {GASKET_MATERIALS.map((m) => <option key={m}>{m}</option>)}
                </SelectInput>
              </Field>
              <Field label="End connection">
                <SelectInput value={config.endConnection} onChange={(e) => set("endConnection", e.target.value as SfiConfig["endConnection"])}>
                  {END_CONNECTIONS.map((m) => <option key={m}>{m}</option>)}
                </SelectInput>
              </Field>
              {needsFlangeFace(config.endConnection) && (
                <Field label="Flange face">
                  <SelectInput value={config.flangeFace} onChange={(e) => set("flangeFace", e.target.value as SfiConfig["flangeFace"])}>
                    {FLANGE_FACES.map((m) => <option key={m}>{m}</option>)}
                  </SelectInput>
                </Field>
              )}
            </div>

            <ChipGroup
              label="Flow direction"
              value={config.flowDirection}
              onChange={(v) => set("flowDirection", v)}
              options={compatibleFlow(config.product).map((f) => ({ value: f.id, label: f.label }))}
            />

            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Fluid / media">
                <TextInput value={config.fluid} maxLength={200} placeholder="e.g. Cooling water" onChange={(e) => set("fluid", e.target.value)} />
              </Field>
              <Field label="Quantity">
                <TextInput type="number" min={1} value={config.quantity} onChange={(e) => set("quantity", Math.max(1, Number(e.target.value) || 1))} />
              </Field>
              <Field label="Operating pressure">
                <TextInput value={config.operatingPressure} maxLength={60} placeholder="e.g. 10 barg" onChange={(e) => set("operatingPressure", e.target.value)} />
              </Field>
              <Field label="Design pressure">
                <TextInput value={config.designPressure} maxLength={60} placeholder="e.g. 16 barg" onChange={(e) => set("designPressure", e.target.value)} />
              </Field>
              <Field label="Operating temperature">
                <TextInput value={config.operatingTemperature} maxLength={60} placeholder="e.g. 80 °C" onChange={(e) => set("operatingTemperature", e.target.value)} />
              </Field>
              <Field label="Design temperature">
                <TextInput value={config.designTemperature} maxLength={60} placeholder="e.g. 120 °C" onChange={(e) => set("designTemperature", e.target.value)} />
              </Field>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="border border-border bg-surface">
              <div className="label-tech border-b border-border px-5 py-4 text-foreground">Configuration summary</div>
              <dl>
                {Object.entries(summary).map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[130px_1fr] gap-3 border-b border-border px-5 py-2.5 text-sm">
                    <dt className="label-tech pt-0.5">{k}</dt>
                    <dd className={v.startsWith("Contact") ? "font-mono text-xs text-muted-foreground" : "font-mono text-xs"}>{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="p-5">
                <Button variant="industrial" size="xl" className="w-full" onClick={onRequestQuote}>
                  Add to quotation request <ArrowRight />
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

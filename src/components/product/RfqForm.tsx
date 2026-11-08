import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Download, FileText, Upload } from "lucide-react";
import { BODY_MATERIALS, END_CONNECTIONS, NB_SIZES, PRESSURE_CLASSES, PRODUCT_LABEL, nbToInch } from "@/lib/specs";
import { PRODUCT_TYPE_OPTIONS, rfqSchema, submitRfq, validateAttachment, type RfqResult } from "@/lib/rfq";
import { configSummary, type SfiConfig } from "@/lib/configurator";
import { Button } from "@/components/ui/button";
import { Reveal, SectionLabel } from "@/components/site/Reveal";
import { Field, SelectInput, TextArea, TextInput } from "./fields";

type FormInput = {
  name: string;
  company: string;
  email: string;
  phone: string;
  productType: string;
  nbSize: string;
  pressureClass: string;
  bodyMaterial: string;
  endConnection: string;
  fluid: string;
  operatingPressure: string;
  operatingTemperature: string;
  quantity: string | number;
  deliveryLocation: string;
  requirements: string;
};

const EMPTY: FormInput = {
  name: "",
  company: "",
  email: "",
  phone: "",
  productType: "",
  nbSize: "",
  pressureClass: "",
  bodyMaterial: "",
  endConnection: "",
  fluid: "",
  operatingPressure: "",
  operatingTemperature: "",
  quantity: 1,
  deliveryLocation: "",
  requirements: "",
};

function fromConfig(c: SfiConfig): Partial<FormInput> {
  return {
    productType: PRODUCT_LABEL[c.product],
    nbSize: String(c.nb),
    pressureClass: c.pressure,
    bodyMaterial: c.bodyMaterial,
    endConnection: c.endConnection,
    fluid: c.fluid,
    operatingPressure: c.operatingPressure,
    operatingTemperature: c.operatingTemperature,
    quantity: c.quantity,
  };
}

export function RfqForm({ config, version = 0, index = "08" }: { config?: SfiConfig; version?: number; index?: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [result, setResult] = useState<(RfqResult & { summary: Record<string, string> }) | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({
    // Resolver validates and coerces; we re-parse in onSubmit for the typed payload.
    resolver: zodResolver(rfqSchema) as never,
    defaultValues: { ...EMPTY, ...(config ? fromConfig(config) : {}) },
  });

  useEffect(() => {
    if (config && version > 0) reset({ ...getValues(), ...fromConfig(config) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version]);

  const onSubmit = async (raw: FormInput) => {
    const fe = validateAttachment(file);
    setFileError(fe);
    if (fe) return;
    const values = rfqSchema.parse(raw);
    const summary = config ? configSummary(config) : {};
    const res = await submitRfq({
      ...values,
      configuration: summary,
      ...(file ? { attachmentName: file.name } : {}),
    });
    setResult({ ...res, summary: { ...summary, ...Object.fromEntries(Object.entries(values).map(([k, v]) => [k, String(v ?? "")])) } });
  };

  const downloadSummary = () => {
    if (!result) return;
    const lines = [`SFI ENGINEERING — QUOTATION REQUEST ${result.reference}`, "", ...Object.entries(result.summary).map(([k, v]) => `${k}: ${v}`)];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${result.reference}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const summary = config ? configSummary(config) : null;

  return (
    <section id="rfq" className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10">
        <Reveal>
          <SectionLabel index={index}>Request quotation</SectionLabel>
          <h2 className="display-lg mt-6 max-w-4xl">Request a technical &amp; commercial quotation.</h2>
        </Reveal>

        {result ? (
          <div className="mt-14 max-w-2xl border border-primary/50 p-8">
            <CheckCircle2 className="size-8 text-highlight" />
            <h3 className="mt-4 text-2xl font-medium">Request prepared — reference {result.reference}</h3>
            <p className="mt-3 text-muted-foreground">
              Your request has been checked and is ready. Online delivery to our sales team is not connected yet, so
              nothing has been sent. Download the summary and share it with us directly.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="industrial" size="xl" onClick={downloadSummary}>
                <Download /> Download request summary
              </Button>
              <Button variant="technical" size="xl" onClick={() => setResult(null)}>
                Edit request
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-14 grid gap-12 lg:grid-cols-[1.5fr_1fr]">
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label="Name" error={errors.name?.message}><TextInput autoComplete="name" {...register("name")} /></Field>
              <Field label="Company name" error={errors.company?.message}><TextInput autoComplete="organization" {...register("company")} /></Field>
              <Field label="Business email" error={errors.email?.message}><TextInput type="email" autoComplete="email" {...register("email")} /></Field>
              <Field label="Phone number" error={errors.phone?.message}><TextInput type="tel" autoComplete="tel" {...register("phone")} /></Field>
              <Field label="Product type" error={errors.productType?.message}>
                <SelectInput {...register("productType")}>
                  <option value="">Select…</option>
                  {PRODUCT_TYPE_OPTIONS.map((o) => <option key={o}>{o}</option>)}
                </SelectInput>
              </Field>
              <Field label="NB size" error={errors.nbSize?.message}>
                <SelectInput {...register("nbSize")}>
                  <option value="">Select…</option>
                  {NB_SIZES.map((n) => <option key={n} value={n}>{n} NB ({nbToInch(n)})</option>)}
                </SelectInput>
              </Field>
              <Field label="Pressure class" error={errors.pressureClass?.message}>
                <SelectInput {...register("pressureClass")}>
                  <option value="">Select…</option>
                  {PRESSURE_CLASSES.map((o) => <option key={o}>{o}</option>)}
                </SelectInput>
              </Field>
              <Field label="Body material" error={errors.bodyMaterial?.message}>
                <SelectInput {...register("bodyMaterial")}>
                  <option value="">Select…</option>
                  {BODY_MATERIALS.map((o) => <option key={o}>{o}</option>)}
                </SelectInput>
              </Field>
              <Field label="End connection" error={errors.endConnection?.message}>
                <SelectInput {...register("endConnection")}>
                  <option value="">Select…</option>
                  {END_CONNECTIONS.map((o) => <option key={o}>{o}</option>)}
                </SelectInput>
              </Field>
              <Field label="Fluid / media" error={errors.fluid?.message}><TextInput {...register("fluid")} /></Field>
              <Field label="Operating pressure" error={errors.operatingPressure?.message}><TextInput placeholder="e.g. 10 barg" {...register("operatingPressure")} /></Field>
              <Field label="Operating temperature" error={errors.operatingTemperature?.message}><TextInput placeholder="e.g. 80 °C" {...register("operatingTemperature")} /></Field>
              <Field label="Quantity" error={errors.quantity?.message}><TextInput type="number" min={1} {...register("quantity")} /></Field>
              <Field label="Required delivery location" error={errors.deliveryLocation?.message}><TextInput {...register("deliveryLocation")} /></Field>
              <div className="sm:col-span-2">
                <Field label="Technical requirements" error={errors.requirements?.message}><TextArea {...register("requirements")} /></Field>
              </div>
              <div className="sm:col-span-2">
                <span className="label-tech mb-2 block">Upload drawing / specification PDF</span>
                <label className="flex cursor-pointer items-center gap-3 border border-dashed border-input px-4 py-5 transition-colors hover:border-primary">
                  {file ? <FileText className="size-5 text-highlight" /> : <Upload className="size-5 text-muted-foreground" />}
                  <span className="font-mono text-sm">{file ? file.name : "Choose a PDF (max 10 MB)"}</span>
                  <input
                    type="file"
                    accept="application/pdf,.pdf"
                    className="sr-only"
                    onChange={(e) => {
                      const f = e.target.files?.[0] ?? null;
                      setFile(f);
                      setFileError(validateAttachment(f));
                    }}
                  />
                </label>
                {fileError && <span className="mt-1 block text-xs text-destructive">{fileError}</span>}
              </div>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="border border-border bg-background">
                <div className="label-tech border-b border-border px-5 py-4 text-foreground">Selected configuration</div>
                {summary ? (
                  <dl>
                    {Object.entries(summary).map(([k, v]) => (
                      <div key={k} className="grid grid-cols-[130px_1fr] gap-3 border-b border-border px-5 py-2 text-sm">
                        <dt className="label-tech pt-0.5">{k}</dt>
                        <dd className="font-mono text-xs">{v}</dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="px-5 py-6 text-sm text-muted-foreground">
                    No configuration attached. Configure a product on its page, or describe your requirements here.
                  </p>
                )}
                <div className="p-5">
                  <Button type="submit" variant="industrial" size="xl" className="h-auto w-full whitespace-normal py-4" disabled={isSubmitting}>
                    Request technical &amp; commercial quotation
                  </Button>
                </div>
              </div>
            </aside>
          </form>
        )}
      </div>
    </section>
  );
}

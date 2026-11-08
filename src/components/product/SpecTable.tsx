import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowDownUp, Download, FileText } from "lucide-react";
import {
  BODY_MATERIALS,
  PRESSURE_CLASSES,
  PRODUCT_LABEL,
  UNVERIFIED,
  buildSpecRows,
  viewLabel,
  type ProductSlug,
  type SpecRow,
} from "@/lib/specs";
import { PRODUCTS } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Field, SelectInput, TextInput } from "./fields";

type SortKey = "nb" | "weight" | "faceToFace" | "viewSize";
const PAGE = 20;

const dimVal = (r: SpecRow, k: SortKey) =>
  k === "nb" ? r.nb : k === "weight" ? r.dims?.weightKg : k === "faceToFace" ? r.dims?.faceToFaceA : r.dims?.viewSizeB;

export function SpecTable() {
  const all = useMemo(() => buildSpecRows(), []);
  const [q, setQ] = useState("");
  const [product, setProduct] = useState<"" | ProductSlug>("");
  const [pressure, setPressure] = useState("");
  const [material, setMaterial] = useState("");
  const [sort, setSort] = useState<SortKey>("nb");
  const [dir, setDir] = useState<1 | -1>(1);
  const [page, setPage] = useState(0);

  const rows = useMemo(() => {
    const term = q.trim().replace(/\s*nb$/i, "");
    const out = all.filter(
      (r) =>
        (!term || String(r.nb).startsWith(term)) &&
        (!product || r.product === product) &&
        (!pressure || r.pressure === pressure) &&
        (!material || r.bodyMaterials.includes(material)),
    );
    return out.sort((a, b) => {
      const av = dimVal(a, sort);
      const bv = dimVal(b, sort);
      // Unverified values always sort last
      if (av === undefined && bv === undefined) return a.nb - b.nb;
      if (av === undefined) return 1;
      if (bv === undefined) return -1;
      return (av - bv) * dir;
    });
  }, [all, q, product, pressure, material, sort, dir]);

  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const view = rows.slice(page * PAGE, page * PAGE + PAGE);

  const downloadCsv = () => {
    const header = ["Product Type", "View Configuration", "NB", "Inch", "Pipe OD Reference (mm)", "Pressure Class", "Face-to-Face A (mm)", "View Size B (mm)", "Bolt Length C (mm)", "Approximate Weight (kg)", "Body Material", "Glass Material", "End Connection"];
    const esc = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;
    const d = (v: number | undefined) => (v === undefined ? UNVERIFIED : v);
    const lines = rows.map((r) =>
      [PRODUCT_LABEL[r.product], viewLabel(r.view), r.nb, r.inch, r.odMm.toFixed(1), r.pressure, d(r.dims?.faceToFaceA), d(r.dims?.viewSizeB), d(r.dims?.boltLengthC), d(r.dims?.weightKg), r.bodyMaterials.join(" / "), r.glass.join(" / "), r.connections.join(" / ")]
        .map(esc)
        .join(","),
    );
    const blob = new Blob([[header.map(esc).join(","), ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "sfi-datasheet.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const reset = (fn: () => void) => {
    fn();
    setPage(0);
  };

  const Th = ({ children, k }: { children: string; k?: SortKey }) => (
    <th className="label-tech whitespace-nowrap border-b border-border px-3 py-3 text-left font-normal">
      {k ? (
        <button
          type="button"
          className="flex items-center gap-1 hover:text-foreground"
          onClick={() => {
            if (sort === k) setDir((d) => (d === 1 ? -1 : 1));
            else setSort(k);
          }}
        >
          {children} <ArrowDownUp className={sort === k ? "size-3 text-highlight" : "size-3"} />
        </button>
      ) : (
        children
      )}
    </th>
  );
  const pathFor = (s: ProductSlug) => PRODUCTS.find((p) => p.slug === s)!.path;

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-5">
        <Field label="Search by NB">
          <TextInput value={q} placeholder="e.g. 50" onChange={(e) => reset(() => setQ(e.target.value))} />
        </Field>
        <Field label="Product type">
          <SelectInput value={product} onChange={(e) => reset(() => setProduct(e.target.value as ProductSlug | ""))}>
            <option value="">All types</option>
            {(Object.keys(PRODUCT_LABEL) as ProductSlug[]).map((p) => <option key={p} value={p}>{PRODUCT_LABEL[p]}</option>)}
          </SelectInput>
        </Field>
        <Field label="Pressure class">
          <SelectInput value={pressure} onChange={(e) => reset(() => setPressure(e.target.value))}>
            <option value="">All classes</option>
            {PRESSURE_CLASSES.filter((p) => p !== "Other / Enquiry").map((p) => <option key={p}>{p}</option>)}
          </SelectInput>
        </Field>
        <Field label="Material">
          <SelectInput value={material} onChange={(e) => reset(() => setMaterial(e.target.value))}>
            <option value="">All materials</option>
            {BODY_MATERIALS.filter((m) => m !== "Others").map((m) => <option key={m}>{m}</option>)}
          </SelectInput>
        </Field>
        <Field label="Sort by">
          <SelectInput value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            <option value="nb">NB size</option>
            <option value="weight">Weight</option>
            <option value="faceToFace">Face-to-face A</option>
            <option value="viewSize">View size B</option>
          </SelectInput>
        </Field>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="label-tech">{rows.length} configurations</div>
        <div className="flex flex-wrap gap-2">
          <Button variant="technical" onClick={downloadCsv}><Download /> Download datasheet (CSV)</Button>
          <Button variant="technical" asChild>
            <Link to="/contact"><FileText /> Request dimension drawing</Link>
          </Button>
          <Button variant="industrial" asChild>
            <Link to="/contact">Request quotation</Link>
          </Button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto border border-border">
        <table className="w-full min-w-[1200px] border-collapse font-mono text-xs">
          <thead className="bg-surface">
            <tr>
              <Th>Product type</Th>
              <Th>View config</Th>
              <Th k="nb">NB</Th>
              <Th>Inch</Th>
              <Th>Pipe OD (mm)</Th>
              <Th>Pressure class</Th>
              <Th k="faceToFace">F-to-F A (mm)</Th>
              <Th k="viewSize">View B (mm)</Th>
              <Th>Bolt C (mm)</Th>
              <Th k="weight">Weight (kg)</Th>
              <Th>Body material</Th>
              <Th>Glass</Th>
              <Th>End connection</Th>
              <Th>RFQ</Th>
            </tr>
          </thead>
          <tbody>
            {view.map((r) => (
              <tr key={`${r.product}-${r.view}-${r.nb}-${r.pressure}`} className="border-b border-border hover:bg-card">
                <td className="px-3 py-2.5">{PRODUCT_LABEL[r.product]}</td>
                <td className="px-3 py-2.5 text-muted-foreground">{viewLabel(r.view)}</td>
                <td className="px-3 py-2.5 text-highlight">{r.nb}</td>
                <td className="px-3 py-2.5">{r.inch}</td>
                <td className="px-3 py-2.5">{r.odMm.toFixed(1)}</td>
                <td className="px-3 py-2.5">{r.pressure}</td>
                {[r.dims?.faceToFaceA, r.dims?.viewSizeB, r.dims?.boltLengthC, r.dims?.weightKg].map((v, i) => (
                  <td key={i} className="px-3 py-2.5 text-muted-foreground" title={v === undefined ? UNVERIFIED : undefined}>
                    {v ?? "On request"}
                  </td>
                ))}
                <td className="px-3 py-2.5 text-muted-foreground">CS · SS · Alloys</td>
                <td className="px-3 py-2.5 text-muted-foreground">Borosilicate · Soda lime</td>
                <td className="px-3 py-2.5 text-muted-foreground">Flanged · Threaded · SW</td>
                <td className="px-3 py-2.5">
                  <Link to={pathFor(r.product)} hash="rfq" className="text-primary hover:text-highlight">Quote →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        "On request": {UNVERIFIED} NB, inch and pipe OD values follow ASME B36.10M.
      </p>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="technical" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Previous</Button>
        <span className="label-tech">Page {page + 1} / {pages}</span>
        <Button variant="technical" disabled={page >= pages - 1} onClick={() => setPage((p) => p + 1)}>Next</Button>
      </div>
    </div>
  );
}

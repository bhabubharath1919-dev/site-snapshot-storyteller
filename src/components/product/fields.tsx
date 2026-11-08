import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const base =
  "w-full rounded-none border border-input bg-background px-3 py-2.5 font-mono text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary";

export function Field({ label, error, children, hint }: { label: string; error?: string | undefined; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="label-tech mb-2 block">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ className, ...p }, ref) => (
  <input ref={ref} className={cn(base, className)} {...p} />
));
TextInput.displayName = "TextInput";

export const SelectInput = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(({ className, children, ...p }, ref) => (
  <select ref={ref} className={cn(base, "appearance-none bg-[length:10px] pr-8", className)} {...p}>
    {children}
  </select>
));
SelectInput.displayName = "SelectInput";

export const TextArea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...p }, ref) => (
  <textarea ref={ref} className={cn(base, "min-h-28", className)} {...p} />
));
TextArea.displayName = "TextArea";

export function ChipGroup<T extends string | number>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div>
      <div className="label-tech mb-2">{label}</div>
      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={o.value === value}
            data-active={o.value === value}
            onClick={() => onChange(o.value)}
            className="border border-border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground data-[active=true]:border-primary data-[active=true]:bg-primary/15 data-[active=true]:text-foreground"
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

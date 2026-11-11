import type { ReactNode } from "react";
import { SectionLabel } from "./Reveal";

export function PageHeader({ label, title, children }: { label: string; title: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="tech-grid absolute inset-0 opacity-60" aria-hidden />
      <div className="stage-light absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-[1600px] px-5 pb-20 pt-36 md:px-10">
        <SectionLabel>{label}</SectionLabel>
        <h1 className="display-xl mt-6 max-w-5xl">{title}</h1>
        {children && <div className="mt-8 max-w-2xl text-lg text-muted-foreground">{children}</div>}
      </div>
    </section>
  );
}

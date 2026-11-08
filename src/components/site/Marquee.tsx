const ITEMS = ["FLOW VISIBILITY", "ENGINEERING PRECISION", "INDUSTRIAL RELIABILITY", "MATERIAL INTEGRITY"];

export function Marquee() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="relative overflow-hidden border-y border-border bg-surface py-6" aria-label={ITEMS.join(" / ")}>
      <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap" aria-hidden>
        {[...row, ...row].map((t, i) => (
          <div key={i} className="flex items-center gap-10">
            <span className="font-display text-2xl font-medium tracking-tight text-foreground/85 md:text-4xl">{t}</span>
            <span className="font-mono text-sm text-highlight">/</span>
          </div>
        ))}
      </div>
    </div>
  );
}

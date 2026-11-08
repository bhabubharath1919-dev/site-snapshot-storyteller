import { Link } from "@tanstack/react-router";
import { PRODUCTS } from "@/lib/products";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 py-16 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5">
          <div className="font-display text-sm font-semibold tracking-[0.22em]">SFI ENGINEERING</div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Precision-engineered Sight Flow Indicators for industrial process monitoring.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex border border-primary px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors hover:bg-primary"
          >
            Request a quotation
          </Link>
        </div>
        <div className="md:col-span-3">
          <div className="label-tech mb-4">Sight Flow Indicators</div>
          <ul className="space-y-2 text-sm">
            {PRODUCTS.map((p) => (
              <li key={p.slug}>
                <Link to={p.path} className="text-foreground/80 hover:text-highlight">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2">
          <div className="label-tech mb-4">Company</div>
          <ul className="space-y-2 text-sm">
            <li><Link to="/engineering" className="text-foreground/80 hover:text-highlight">Engineering</Link></li>
            <li><Link to="/applications" className="text-foreground/80 hover:text-highlight">Applications</Link></li>
            <li><Link to="/technical-resources" className="text-foreground/80 hover:text-highlight">Technical Resources</Link></li>
            <li><Link to="/contact" className="text-foreground/80 hover:text-highlight">Contact</Link></li>
          </ul>
        </div>
        <div className="md:col-span-2">
          <div className="label-tech mb-4">Note</div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Product renders and 3D models are concept visualizations, not certified engineering drawings.
          </p>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1600px] flex-col justify-between gap-2 px-5 py-6 md:flex-row md:px-10">
          <span className="label-tech">© {new Date().getFullYear()} SFI Engineering</span>
          <span className="label-tech">See the flow. Understand the process.</span>
        </div>
      </div>
    </footer>
  );
}

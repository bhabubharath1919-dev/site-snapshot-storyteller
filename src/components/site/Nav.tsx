import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { PRODUCTS } from "@/lib/products";
import { cn } from "@/lib/utils";

const LINKS = [
  { to: "/engineering", label: "Engineering" },
  { to: "/applications", label: "Applications" },
  { to: "/technical-resources", label: "Technical Resources" },
  { to: "/contact", label: "Contact" },
] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
    setMobile(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const linkCls = "label-tech text-foreground/75 transition-colors hover:text-foreground";
  const activeCls = { className: "!text-foreground" };

  return (
    <header
      ref={panelRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500",
        scrolled || open || mobile ? "border-border bg-background/95" : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 md:px-10">
        <Link to="/" className="flex items-center gap-3" aria-label="SFI Engineering home">
          <span className="relative grid size-7 place-items-center border border-foreground/40">
            <span className="size-2.5 rounded-full border border-highlight" />
          </span>
          <span className="font-display text-sm font-semibold tracking-[0.22em]">SFI ENGINEERING</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          <Link to="/" className={linkCls} activeProps={activeCls} activeOptions={{ exact: true }}>
            Home
          </Link>
          <button
            type="button"
            className={cn(linkCls, "flex items-center gap-1.5", (open || pathname.startsWith("/products")) && "text-foreground")}
            aria-expanded={open}
            aria-controls="products-menu"
            onClick={() => setOpen((o) => !o)}
          >
            Products <ChevronDown className={cn("size-3 transition-transform", open && "rotate-180")} />
          </button>
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className={linkCls} activeProps={activeCls}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/contact"
            className="hidden border border-primary px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-primary md:inline-flex"
          >
            Request quote
          </Link>
          <button
            type="button"
            className="grid size-10 place-items-center border border-border lg:hidden"
            aria-label={mobile ? "Close menu" : "Open menu"}
            onClick={() => setMobile((m) => !m)}
          >
            {mobile ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {/* Products mega menu */}
      <div
        id="products-menu"
        className={cn(
          "absolute inset-x-0 top-16 hidden overflow-hidden border-b border-border bg-background transition-[max-height,opacity] duration-500 lg:block",
          open ? "max-h-[520px] opacity-100" : "pointer-events-none max-h-0 opacity-0",
        )}
      >
        <div className="mx-auto max-w-[1600px] px-10 py-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="label-tech">
              Products <span className="mx-2 text-foreground/30">/</span>
              <span className="text-foreground">Sight Flow Indicators</span>
            </div>
            <Link to="/products" className="label-tech flex items-center gap-1 hover:text-highlight">
              View all types <ArrowUpRight className="size-3" />
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-px bg-border">
            {PRODUCTS.map((p) => (
              <Link key={p.slug} to={p.path} className="group relative bg-background p-5 transition-colors hover:bg-card">
                <div className="relative mb-4 aspect-[4/3] overflow-hidden bg-surface">
                  <img
                    src={p.image}
                    alt={`${p.name} sight flow indicator concept render`}
                    width={1024}
                    height={1024}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <span className="label-tech absolute left-3 top-3 text-highlight">{p.index}</span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-display text-lg font-medium">{p.name}</div>
                    <p className="mt-1 text-sm text-muted-foreground">{p.short}</p>
                  </div>
                  <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-highlight" />
                </div>
                <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-highlight transition-transform duration-500 group-hover:scale-x-100" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobile && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-border bg-background px-5 pb-8 lg:hidden">
          <Link to="/" className="block border-b border-border py-4 font-display text-xl">
            Home
          </Link>
          <div className="border-b border-border py-4">
            <Link to="/products" className="font-display text-xl">
              Products
            </Link>
            <div className="label-tech mt-3">Sight Flow Indicators</div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {PRODUCTS.map((p) => (
                <Link key={p.slug} to={p.path} className="border border-border p-2">
                  <img src={p.image} alt="" width={1024} height={1024} loading="lazy" className="aspect-square w-full object-cover" />
                  <div className="mt-2 text-sm font-medium">{p.name}</div>
                </Link>
              ))}
            </div>
          </div>
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="block border-b border-border py-4 font-display text-xl">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

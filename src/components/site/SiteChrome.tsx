import { Link } from "@tanstack/react-router";
import { Menu, Phone, ShieldCheck, X } from "lucide-react";
import { useState } from "react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/learn", label: "Practice scenarios" },
  { to: "/verify", label: "Check an offer" },
  { to: "/help", label: "Get help now" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-navy-foreground">
            <ShieldCheck className="h-5 w-5" />
          </span>
          SaferStep
        </Link>
        <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: true }}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground data-[status=active]:bg-secondary data-[status=active]:text-foreground"
            >
              {n.label}
            </Link>
          ))}
          <a href="tel:1930" className="ml-2 flex items-center gap-2 rounded-full bg-destructive px-4 py-2 text-sm font-bold text-destructive-foreground transition hover:opacity-90">
            <Phone className="h-4 w-4" /> 1930
          </a>
        </nav>
        <button className="ml-auto rounded-lg p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="grid gap-1 border-t px-4 py-3 md:hidden" aria-label="Mobile">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 font-medium hover:bg-secondary">
              {n.label}
            </Link>
          ))}
          <a href="tel:1930" className="rounded-lg bg-destructive px-3 py-2 font-bold text-destructive-foreground">Call 1930 — Cyber fraud helpline</a>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold">SaferStep</p>
          <p className="mt-2 text-sm opacity-75">Free scam-awareness guidance. We never ask for passwords, OTPs or bank details, and we don't recommend investments.</p>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Official resources</p>
          <ul className="mt-2 space-y-1 opacity-80">
            <li><a className="hover:underline" href="https://cybercrime.gov.in" target="_blank" rel="noreferrer">cybercrime.gov.in</a></li>
            <li><a className="hover:underline" href="https://investor.sebi.gov.in" target="_blank" rel="noreferrer">SEBI Investor</a></li>
            <li><a className="hover:underline" href="https://scores.sebi.gov.in" target="_blank" rel="noreferrer">SEBI SCORES complaints</a></li>
            <li><a className="hover:underline" href="https://sachet.rbi.org.in" target="_blank" rel="noreferrer">RBI Sachet</a></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Lost money?</p>
          <p className="mt-2 opacity-80">Call your bank, then the National Cyber Crime Helpline <strong>1930</strong> immediately.</p>
        </div>
      </div>
    </footer>
  );
}

import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Menu, Phone, X } from "lucide-react";
import { SHOP } from "@/data/catalog";
import { WhatsAppFab } from "./WhatsAppFab";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/visit", label: "Visit" },
];

export function StoreLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-foreground">
        Skip to content
      </a>
      <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:h-[4.5rem] lg:px-8">
          <Link to="/" className="flex items-center gap-2 cursor-pointer" onClick={() => setOpen(false)}>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-display text-sm font-bold text-primary-foreground">
              AE
            </span>
            <span className="font-display text-lg font-bold uppercase tracking-[0.14em] sm:text-xl">
              {SHOP.shortName}
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "font-display text-sm font-semibold uppercase tracking-[0.18em] transition-colors duration-200 cursor-pointer",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href={SHOP.phoneHref}
              className="inline-flex h-11 items-center gap-2 rounded-full px-3 text-sm font-medium text-foreground transition-colors duration-200 hover:text-muted-foreground cursor-pointer"
            >
              <Phone className="h-4 w-4" aria-hidden />
              {SHOP.phoneDisplay}
            </a>
            <Link
              to="/shop"
              className="inline-flex h-11 items-center rounded-full bg-primary px-5 font-display text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-transform duration-200 hover:scale-[1.03] cursor-pointer"
            >
              Shop now
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border md:hidden cursor-pointer"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <nav id="mobile-nav" className="border-t border-border px-4 py-4 md:hidden" aria-label="Mobile">
            <div className="flex flex-col gap-2">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex min-h-11 items-center rounded-xl px-3 font-display text-lg font-semibold uppercase tracking-wide cursor-pointer",
                      isActive ? "bg-secondary" : "hover:bg-secondary",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
              <a
                href={SHOP.phoneHref}
                className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-base cursor-pointer"
              >
                <Phone className="h-4 w-4" aria-hidden />
                Call {SHOP.phoneDisplay}
              </a>
            </div>
          </nav>
        )}
      </header>

      <main
        id="main"
        key={location.pathname}
        className="page-enter mx-auto w-full max-w-6xl px-4 pb-24 pt-8 sm:px-6 lg:px-8"
      >
        <Outlet />
      </main>

      <footer className="border-t border-border bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <p className="font-display text-3xl font-bold uppercase tracking-tight">{SHOP.name}</p>
            <p className="mt-3 max-w-xs text-sm text-primary-foreground/70">
              Shoes, bags and luggage in Fort Portal. Walk in or order on WhatsApp.
            </p>
          </div>
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">
              Visit
            </p>
            <p className="mt-3 text-sm leading-relaxed">
              {SHOP.address}
              <br />
              {SHOP.city}
            </p>
          </div>
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">
              Call
            </p>
            <a href={SHOP.phoneHref} className="mt-3 block text-lg font-semibold cursor-pointer hover:underline">
              {SHOP.phoneDisplay}
            </a>
            <a href={SHOP.phone2Href} className="mt-1 block text-lg font-semibold cursor-pointer hover:underline">
              {SHOP.phone2Display}
            </a>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-primary-foreground/50">
          Apuuli Enterprises, Fort Portal
        </div>
      </footer>

      <WhatsAppFab />
    </div>
  );
}

import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CATEGORIES, PRODUCTS, type Category } from "@/data/catalog";
import { ProductCard } from "@/components/store/ProductCard";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

export default function ShopPage() {
  const [params, setParams] = useSearchParams();
  const initial = (params.get("cat") as Category | "all") || "all";
  const [active, setActive] = useState<Category | "all">(
    CATEGORIES.some((c) => c.id === initial) ? initial : "all",
  );
  const reveal = useReveal<HTMLElement>(35);

  const items = useMemo(
    () => (active === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === active)),
    [active],
  );

  const select = (id: Category | "all") => {
    setActive(id);
    if (id === "all") setParams({});
    else setParams({ cat: id });
  };

  return (
    <div>
      <header className="max-w-2xl">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Catalog
        </p>
        <h1 className="mt-3 text-5xl sm:text-6xl">Shop Apuuli</h1>
        <p className="mt-4 text-muted-foreground">
          Filter by who it is for. Tap a pair, pick a size, order on WhatsApp.
        </p>
      </header>

      <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Product categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={active === cat.id}
            onClick={() => select(cat.id)}
            className={cn(
              "inline-flex h-11 min-w-[44px] items-center rounded-full px-5 font-display text-sm font-semibold uppercase tracking-[0.14em] transition-colors duration-200 cursor-pointer",
              active === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground hover:bg-secondary/70",
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-muted-foreground" aria-live="polite">
        {items.length} {items.length === 1 ? "piece" : "pieces"}
      </p>

      <section key={active} ref={reveal} className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </section>
    </div>
  );
}

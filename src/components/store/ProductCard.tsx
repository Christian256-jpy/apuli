import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { formatUgx, type Product } from "@/data/catalog";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/shop/${product.slug}`}
      data-reveal
      className="group block cursor-pointer outline-none"
    >
      <article className="flex h-full flex-col">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary">
          <img
            src={product.image}
            alt={product.name}
            width={800}
            height={800}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-focus-visible:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground">
            {product.category === "bags" ? "Bags" : product.category}
          </span>
          <span className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
            <ArrowUpRight className="h-5 w-5" aria-hidden />
            <span className="sr-only">View {product.name}</span>
          </span>
        </div>
        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-xl font-bold uppercase tracking-tight">{product.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{product.tagline}</p>
          </div>
          <p className="shrink-0 font-display text-lg font-semibold tabular-nums">{formatUgx(product.price)}</p>
        </div>
      </article>
    </Link>
  );
}

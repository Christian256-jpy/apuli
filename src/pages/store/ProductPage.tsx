import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, MessageCircle, Phone } from "lucide-react";
import { formatUgx, getProduct, relatedProducts, SHOP } from "@/data/catalog";
import { orderMessage, whatsappUrl } from "@/lib/whatsapp";
import { ProductCard } from "@/components/store/ProductCard";
import { useReveal } from "@/hooks/useReveal";

export default function ProductPage() {
  const { slug } = useParams();
  const product = slug ? getProduct(slug) : undefined;
  const related = useMemo(() => (product ? relatedProducts(product) : []), [product]);
  const [size, setSize] = useState(product?.sizes[0] ?? "");
  const reveal = useReveal<HTMLElement>(40);

  useEffect(() => {
    if (product) setSize(product.sizes[0]);
  }, [product]);

  if (!product) return <Navigate to="/shop" replace />;

  const orderHref = whatsappUrl(orderMessage(product, size || product.sizes[0]));

  return (
    <div>
      <Link
        to="/shop"
        className="inline-flex h-11 items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to shop
      </Link>

      <div className="mt-6 grid items-start gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-[2rem] bg-secondary">
          <img
            src={product.image}
            alt={product.name}
            width={1000}
            height={1000}
            className="aspect-square w-full object-cover"
          />
        </div>

        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {product.category === "bags" ? "Bags & luggage" : product.category}
          </p>
          <h1 className="mt-3 text-5xl sm:text-6xl">{product.name}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{product.tagline}</p>
          <p className="mt-6 font-display text-3xl font-bold tabular-nums">{formatUgx(product.price)}</p>
          <p className="mt-2 text-sm text-muted-foreground">Price confirmed on WhatsApp. Stock moves fast.</p>

          <fieldset className="mt-8">
            <legend className="font-display text-sm font-semibold uppercase tracking-[0.18em]">
              Size
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  aria-pressed={size === s}
                  className={`inline-flex h-11 min-w-[44px] items-center justify-center rounded-full px-4 text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                    size === s
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/70"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={orderHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary font-display text-sm font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-transform duration-200 hover:scale-[1.02] cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              Order on WhatsApp
            </a>
            <a
              href={SHOP.phoneHref}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border px-6 font-display text-sm font-semibold uppercase tracking-[0.16em] cursor-pointer"
            >
              <Phone className="h-4 w-4" aria-hidden />
              Call
            </a>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section ref={reveal} className="mt-20">
          <h2 className="text-3xl" data-reveal>
            More like this
          </h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

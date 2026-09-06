import { Link } from "react-router-dom";
import { ArrowRight, MapPin, MessageCircle, Phone, Sparkles } from "lucide-react";
import { featuredProducts, SHOP, formatUgx } from "@/data/catalog";
import { browseMessage, whatsappUrl } from "@/lib/whatsapp";
import { ProductCard } from "@/components/store/ProductCard";
import { useReveal } from "@/hooks/useReveal";

const STRIP = ["Sneakers", "Formal", "Sandals", "Boots", "Kids", "Backpacks", "Suitcases", "Duffels"];

export default function HomePage() {
  const reveal = useReveal<HTMLElement>(50);
  const featured = featuredProducts();
  const hero = featured[0];

  return (
    <div className="space-y-24 pb-8">
      <section className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Fort Portal · Behind KCB Bank
          </p>
          <h1 className="mt-4 max-w-xl text-6xl leading-[0.88] sm:text-7xl lg:text-8xl">
            Step into
            <span className="block text-transparent" style={{ WebkitTextStroke: "2px hsl(var(--foreground))" }}>
              Apuuli
            </span>
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">
            Shoes for men, women and kids. Bags and luggage on the same floor. Order on WhatsApp or walk into Nakaseke taxi park.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/shop"
              className="inline-flex h-12 min-w-[44px] items-center gap-2 rounded-full bg-primary px-6 font-display text-sm font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-transform duration-200 hover:scale-[1.03] cursor-pointer"
            >
              Shop the floor
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a
              href={whatsappUrl(browseMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 min-w-[44px] items-center gap-2 rounded-full border border-foreground/15 px-6 font-display text-sm font-semibold uppercase tracking-[0.16em] transition-colors duration-200 hover:bg-secondary cursor-pointer"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              WhatsApp order
            </a>
          </div>
        </div>

        <Link to={hero ? `/shop/${hero.slug}` : "/shop"} className="relative cursor-pointer">
          <div className="absolute -inset-6 rounded-[2.5rem] bg-accent/40 blur-2xl" aria-hidden />
          <div className="relative overflow-hidden rounded-[2rem] bg-secondary p-6 sm:p-10">
            <img
              src={hero?.image ?? "/shop/street-runner.jpg"}
              alt={hero?.name ?? "Featured shoe"}
              width={900}
              height={900}
              className="hero-float mx-auto w-[88%] object-contain drop-shadow-2xl"
            />
            {hero && (
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between rounded-2xl bg-background/90 px-4 py-3 backdrop-blur">
                <div>
                  <p className="font-display text-lg font-bold uppercase">{hero.name}</p>
                  <p className="text-sm text-muted-foreground">{formatUgx(hero.price)}</p>
                </div>
                <span className="font-display text-xs font-semibold uppercase tracking-[0.16em]">View</span>
              </div>
            )}
          </div>
        </Link>
      </section>

      <div className="overflow-hidden border-y border-border py-3">
        <div className="marquee-track flex w-max gap-10 font-display text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          {[...STRIP, ...STRIP].map((item, i) => (
            <span key={`${item}-${i}`} className="flex items-center gap-10">
              {item}
              <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden />
            </span>
          ))}
        </div>
      </div>

      <section ref={reveal}>
        <div className="mb-8 flex items-end justify-between gap-4" data-reveal>
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Drops
            </p>
            <h2 className="mt-2 text-4xl sm:text-5xl">On the floor now</h2>
          </div>
          <Link
            to="/shop"
            className="hidden h-11 items-center gap-2 font-display text-sm font-semibold uppercase tracking-[0.16em] sm:inline-flex cursor-pointer"
          >
            Full catalog
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          { title: "Men · Women · Kids", body: "Sneakers, formal, sandals and boots sized for the whole family." },
          { title: "Bags & luggage", body: "Backpacks, duffels and hard-shell cases stacked on the same shop." },
          { title: "WhatsApp in seconds", body: "Pick a size, tap order, we confirm stock before you come." },
        ].map((item) => (
          <div key={item.title} className="rounded-3xl bg-secondary p-7">
            <h3 className="text-2xl">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-[2rem] bg-primary text-primary-foreground">
        <div className="grid md:grid-cols-2">
          <img
            src="/shop/storefront.webp"
            alt="Apuuli Enterprises shopfront at Nakaseke taxi park"
            className="h-72 w-full object-cover md:h-full"
            width={1200}
            height={800}
          />
          <div className="flex flex-col justify-center p-8 sm:p-12">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-primary-foreground/60">
              Find us
            </p>
            <h2 className="mt-3 text-4xl sm:text-5xl">Nakaseke taxi park</h2>
            <p className="mt-4 max-w-sm text-primary-foreground/75">
              Behind KCB Bank, Fort Portal. Look for the Apuuli Enterprises board.
            </p>
            <div className="mt-8 flex flex-col gap-3 text-sm">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" aria-hidden />
                {SHOP.locationLine}
              </span>
              <a href={SHOP.phoneHref} className="inline-flex items-center gap-2 hover:underline cursor-pointer">
                <Phone className="h-4 w-4" aria-hidden />
                {SHOP.phoneDisplay} · {SHOP.phone2Display}
              </a>
            </div>
            <Link
              to="/visit"
              className="mt-8 inline-flex h-12 w-fit items-center rounded-full bg-accent px-6 font-display text-sm font-semibold uppercase tracking-[0.16em] text-accent-foreground transition-transform duration-200 hover:scale-[1.03] cursor-pointer"
            >
              Visit the shop
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

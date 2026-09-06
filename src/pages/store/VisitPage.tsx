import { MapPin, MessageCircle, Phone, Clock } from "lucide-react";
import { SHOP } from "@/data/catalog";
import { browseMessage, whatsappUrl } from "@/lib/whatsapp";
import { useReveal } from "@/hooks/useReveal";

export default function VisitPage() {
  const reveal = useReveal<HTMLElement>(50);

  return (
    <div className="space-y-16 pb-8">
      <header className="max-w-2xl">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          Visit
        </p>
        <h1 className="mt-3 text-5xl sm:text-6xl">Come to the park</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Apuuli Enterprises sits in Nakaseke taxi park, Fort Portal, behind KCB Bank. Look for the board with the shoe and bag artwork.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <figure className="overflow-hidden rounded-[1.75rem] lg:col-span-2">
          <img
            src="/shop/storefront.webp"
            alt="Apuuli Enterprises storefront sign at Nakaseke taxi park"
            className="h-full min-h-[280px] w-full object-cover"
            width={1600}
            height={900}
          />
        </figure>
        <figure className="overflow-hidden rounded-[1.75rem]">
          <img
            src="/shop/stock.webp"
            alt="Shoe boxes and packed footwear stacked inside the shop"
            className="h-full min-h-[280px] w-full object-cover"
            width={800}
            height={1200}
          />
        </figure>
      </div>

      <section ref={reveal} className="grid gap-6 md:grid-cols-3">
        <article data-reveal className="rounded-3xl bg-secondary p-7">
          <MapPin className="h-5 w-5" aria-hidden />
          <h2 className="mt-4 text-2xl">Address</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{SHOP.locationLine}</p>
        </article>
        <article data-reveal className="rounded-3xl bg-secondary p-7">
          <Clock className="h-5 w-5" aria-hidden />
          <h2 className="mt-4 text-2xl">Hours</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {SHOP.hours.map((row) => (
              <li key={row.day}>
                <span className="font-medium text-foreground">{row.day}</span>
                <br />
                {row.time}
              </li>
            ))}
          </ul>
        </article>
        <article data-reveal className="rounded-3xl bg-primary p-7 text-primary-foreground">
          <Phone className="h-5 w-5" aria-hidden />
          <h2 className="mt-4 text-2xl">Call or chat</h2>
          <a href={SHOP.phoneHref} className="mt-3 block text-lg font-semibold hover:underline cursor-pointer">
            {SHOP.phoneDisplay}
          </a>
          <a href={SHOP.phone2Href} className="mt-1 block text-lg font-semibold hover:underline cursor-pointer">
            {SHOP.phone2Display}
          </a>
          <a
            href={whatsappUrl(browseMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-accent px-5 font-display text-sm font-semibold uppercase tracking-[0.14em] text-accent-foreground cursor-pointer"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            WhatsApp
          </a>
        </article>
      </section>

      <figure className="overflow-hidden rounded-[1.75rem]">
        <img
          src="/shop/luggage.webp"
          alt="Suitcases and travel bags on display at Apuuli Enterprises"
          className="max-h-[520px] w-full object-cover"
          width={1200}
          height={1600}
        />
        <figcaption className="mt-3 text-sm text-muted-foreground">
          Bags, backpacks and hard-shell cases sit with the shoe wall.
        </figcaption>
      </figure>
    </div>
  );
}

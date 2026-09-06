# Apuuli Enterprises Storefront Design

Date: 2026-09-06
Status: Approved

## Goal

Public, animated, multi-page storefront for Apuuli Enterprises so Fort Portal customers can browse shoes, bags, and luggage, then order on WhatsApp.

## Brand

- Name: Apuuli Enterprises (matches shop sign)
- Location: Fort Portal, Nakaseke taxi park, behind KCB Bank
- Phones: 0776069075 (primary WhatsApp), 0780121912
- Personality: Clean athletic modern — white space, condensed type, product-first, lime accent

## Stack

Vite + React + TypeScript + Tailwind + shadcn. Catalog is a local data file. No cart, checkout, or auth on public pages. Existing POS dashboard remains at `/dashboard` but is not linked from the storefront.

## Routes

| Path | Page |
|------|------|
| `/` | Home |
| `/shop` | Catalog with category filters |
| `/shop/:slug` | Product detail + size + WhatsApp order |
| `/visit` | Location, hours, phones, real shop photos |

## Catalog

Categories: Men, Women, Kids, Bags & Luggage.

Sample products in UGX with sizes. Real shop photos used for Visit and Bags storytelling. Product photography uses high-quality athletic stills where individual SKU photos are not available.

## Order flow

Customer picks size, taps Order on WhatsApp. Opens `https://wa.me/256776069075` with product name, size, and price pre-filled. Sticky mobile WhatsApp button on all pages. Second number shown as Call.

## Motion

CSS + Intersection Observer. Hero float, staggered product cards (30–50ms), hover scale on images (transform/opacity only), route fade. Durations 150–400ms. `prefers-reduced-motion: reduce` disables decorative motion.

## Visual system

- Background: off-white
- Text: near-black
- Accent/CTA: electric lime on black
- Headings: Barlow Condensed
- Body: Barlow
- Icons: Lucide SVG only
- Touch targets >= 44px
- Contrast AA+

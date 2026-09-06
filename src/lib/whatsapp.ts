import { SHOP, formatUgx, type Product } from "@/data/catalog";

export const whatsappUrl = (text: string) =>
  `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(text)}`;

export const orderMessage = (product: Product, size: string) =>
  `Hello Apuuli Enterprises, I want to order:\n• ${product.name}\n• Size: ${size}\n• Price: ${formatUgx(product.price)}\nI will collect from Nakaseke taxi park, behind KCB Bank, Fort Portal.`;

export const browseMessage =
  "Hello Apuuli Enterprises, I am looking at your shoes, bags and luggage. Please help me with availability and sizes.";

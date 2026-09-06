export type Category = "men" | "women" | "kids" | "bags";

export type Product = {
  slug: string;
  name: string;
  category: Category;
  tagline: string;
  price: number;
  sizes: string[];
  image: string;
  accent: string;
  featured?: boolean;
};

export const CATEGORIES: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "men", label: "Men" },
  { id: "women", label: "Women" },
  { id: "kids", label: "Kids" },
  { id: "bags", label: "Bags & Luggage" },
];

export const SHOP = {
  name: "Apuuli Enterprises",
  shortName: "APUULI",
  city: "Fort Portal",
  address: "Nakaseke Taxi Park, behind KCB Bank",
  locationLine: "Fort Portal, Nakaseke taxi park, behind KCB Bank",
  whatsapp: "256776069075",
  phoneDisplay: "0776 069 075",
  phoneHref: "tel:+256776069075",
  phone2Display: "0780 121 912",
  phone2Href: "tel:+256780121912",
  hours: [
    { day: "Monday – Saturday", time: "8:00 AM – 7:00 PM" },
    { day: "Sunday", time: "9:00 AM – 5:00 PM" },
  ],
};

export const formatUgx = (n: number) =>
  `UGX ${n.toLocaleString("en-UG")}`;

export const PRODUCTS: Product[] = [
  {
    slug: "street-runner",
    name: "Street Runner",
    category: "men",
    tagline: "Everyday trainer with grip for taxi-park miles.",
    price: 85000,
    sizes: ["40", "41", "42", "43", "44", "45"],
    image: "/shop/street-runner.jpg",
    accent: "#111111",
    featured: true,
  },
  {
    slug: "court-classic",
    name: "Court Classic",
    category: "men",
    tagline: "Clean white court shoe. Office to outing.",
    price: 95000,
    sizes: ["40", "41", "42", "43", "44"],
    image: "/shop/court-classic.jpg",
    accent: "#E8E8E8",
    featured: true,
  },
  {
    slug: "executive-oxford",
    name: "Executive Oxford",
    category: "men",
    tagline: "Polished leather for meetings and Sundays.",
    price: 120000,
    sizes: ["40", "41", "42", "43", "44", "45"],
    image: "/shop/executive-oxford.jpg",
    accent: "#3F2A1D",
  },
  {
    slug: "trail-boot",
    name: "Trail Boot",
    category: "men",
    tagline: "Tough sole. Ready for Fort Portal rains.",
    price: 135000,
    sizes: ["41", "42", "43", "44", "45"],
    image: "/shop/trail-boot.jpg",
    accent: "#2C2416",
  },
  {
    slug: "slide-sandal",
    name: "City Slide",
    category: "men",
    tagline: "Quick-on comfort for heat and home.",
    price: 45000,
    sizes: ["40", "41", "42", "43", "44", "45"],
    image: "/shop/city-slide.jpg",
    accent: "#111111",
  },
  {
    slug: "canvas-low",
    name: "Canvas Low",
    category: "men",
    tagline: "Light, washable, all-day casual.",
    price: 55000,
    sizes: ["39", "40", "41", "42", "43", "44"],
    image: "/shop/canvas-low.jpg",
    accent: "#1D4ED8",
  },
  {
    slug: "everyday-trainer",
    name: "Everyday Trainer",
    category: "women",
    tagline: "Soft foam, street-ready silhouette.",
    price: 80000,
    sizes: ["36", "37", "38", "39", "40", "41"],
    image: "/shop/everyday-trainer.jpg",
    accent: "#F4A6C1",
    featured: true,
  },
  {
    slug: "block-heel",
    name: "Block Heel Pump",
    category: "women",
    tagline: "Stable heel. Work, church, evenings.",
    price: 90000,
    sizes: ["36", "37", "38", "39", "40"],
    image: "/shop/block-heel.jpg",
    accent: "#111111",
  },
  {
    slug: "strappy-sandal",
    name: "Strappy Sandal",
    category: "women",
    tagline: "Open, elegant, made for warm days.",
    price: 50000,
    sizes: ["36", "37", "38", "39", "40"],
    image: "/shop/strappy-sandal.jpg",
    accent: "#C4A574",
  },
  {
    slug: "ankle-boot",
    name: "Ankle Boot",
    category: "women",
    tagline: "Clean line, all-season leather look.",
    price: 110000,
    sizes: ["36", "37", "38", "39", "40", "41"],
    image: "/shop/ankle-boot.jpg",
    accent: "#4A3728",
  },
  {
    slug: "ballet-flat",
    name: "Ballet Flat",
    category: "women",
    tagline: "Fold-and-go comfort with a dress finish.",
    price: 60000,
    sizes: ["36", "37", "38", "39", "40"],
    image: "/shop/ballet-flat.jpg",
    accent: "#EDE6DC",
  },
  {
    slug: "fashion-sneaker",
    name: "Fashion Sneaker",
    category: "women",
    tagline: "Chunky sole, loud on the park walk.",
    price: 75000,
    sizes: ["36", "37", "38", "39", "40", "41"],
    image: "/shop/fashion-sneaker.jpg",
    accent: "#C8F54A",
    featured: true,
  },
  {
    slug: "mini-runner",
    name: "Mini Runner",
    category: "kids",
    tagline: "Light trainers that keep up at school.",
    price: 45000,
    sizes: ["28", "29", "30", "31", "32", "33", "34"],
    image: "/shop/mini-runner.jpg",
    accent: "#2563EB",
    featured: true,
  },
  {
    slug: "school-shoe",
    name: "School Shoe",
    category: "kids",
    tagline: "Black, durable, uniform-ready.",
    price: 50000,
    sizes: ["28", "29", "30", "31", "32", "33", "34", "35"],
    image: "/shop/school-shoe.jpg",
    accent: "#111111",
  },
  {
    slug: "play-sandal",
    name: "Play Sandal",
    category: "kids",
    tagline: "Easy strap. Built for play and travel.",
    price: 35000,
    sizes: ["26", "27", "28", "29", "30", "31", "32"],
    image: "/shop/play-sandal.jpg",
    accent: "#F97316",
  },
  {
    slug: "junior-trainer",
    name: "Junior Trainer",
    category: "kids",
    tagline: "Cushioned kids sneaker with bright hits.",
    price: 55000,
    sizes: ["30", "31", "32", "33", "34", "35", "36"],
    image: "/shop/junior-trainer.jpg",
    accent: "#22C55E",
  },
  {
    slug: "city-backpack",
    name: "City Backpack",
    category: "bags",
    tagline: "Daily pack. School, shop, matatu.",
    price: 70000,
    sizes: ["One size"],
    image: "/shop/stock.webp",
    accent: "#111111",
    featured: true,
  },
  {
    slug: "travel-duffel",
    name: "Travel Duffel",
    category: "bags",
    tagline: "Weekend bag with a strong zip and strap.",
    price: 85000,
    sizes: ["One size"],
    image: "/shop/luggage.webp",
    accent: "#5B4636",
  },
  {
    slug: "hard-shell",
    name: "Hard Shell Suitcase",
    category: "bags",
    tagline: "Spinner wheels. Fort Portal to Kampala.",
    price: 180000,
    sizes: ["Cabin", "Medium", "Large"],
    image: "/shop/luggage.webp",
    accent: "#0EA5E9",
    featured: true,
  },
  {
    slug: "cabin-trolley",
    name: "Cabin Trolley",
    category: "bags",
    tagline: "Carry-on size. Locks and a telescopic handle.",
    price: 150000,
    sizes: ["Cabin"],
    image: "/shop/luggage.webp",
    accent: "#EC4899",
  },
  {
    slug: "school-backpack",
    name: "School Backpack",
    category: "bags",
    tagline: "Tough fabric, roomy, kids and teens.",
    price: 40000,
    sizes: ["One size"],
    image: "/shop/stock.webp",
    accent: "#1D4ED8",
  },
  {
    slug: "weekend-bag",
    name: "Weekend Bag",
    category: "bags",
    tagline: "Soft-sided travel bag from the shop floor.",
    price: 65000,
    sizes: ["One size"],
    image: "/shop/luggage.webp",
    accent: "#78716C",
  },
];

export const getProduct = (slug: string) =>
  PRODUCTS.find((p) => p.slug === slug);

export const featuredProducts = () => PRODUCTS.filter((p) => p.featured);

export const relatedProducts = (product: Product) =>
  PRODUCTS.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);

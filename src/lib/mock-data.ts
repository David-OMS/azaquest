import type { Category, ProductWithRelations } from "@/types/product";

const CATEGORIES: Category[] = [
  { id: "cat-1", name: "Shirts", slug: "shirts", sort_order: 1 },
  { id: "cat-2", name: "Tees", slug: "tees", sort_order: 2 },
  { id: "cat-3", name: "Long Sleeves", slug: "long-sleeves", sort_order: 3 },
  { id: "cat-4", name: "Quarter Zips", slug: "quarter-zips", sort_order: 4 },
  { id: "cat-5", name: "Hoodies", slug: "hoodies", sort_order: 5 },
  { id: "cat-6", name: "Jackets", slug: "jackets", sort_order: 6 },
  { id: "cat-7", name: "Vests", slug: "vests", sort_order: 7 },
  { id: "cat-8", name: "Pants", slug: "pants", sort_order: 8 },
  { id: "cat-9", name: "Jeans", slug: "jeans", sort_order: 9 },
  { id: "cat-10", name: "Shorts", slug: "shorts", sort_order: 10 },
  { id: "cat-11", name: "Rings", slug: "rings", sort_order: 11 },
  { id: "cat-12", name: "Accessories", slug: "accessories", sort_order: 12 },
  { id: "cat-13", name: "Socks", slug: "socks", sort_order: 13 },
];

function img(sku: string, idx = 0): { id: string; product_id: string; url: string; sort_order: number; alt: string | null } {
  return {
    id: `img-${sku}-${idx}`,
    product_id: `prod-${sku}`,
    url: `https://picsum.photos/seed/${sku}${idx ? "b" : ""}/600/800`,
    sort_order: idx,
    alt: null,
  };
}

function product(
  sku: string,
  slug: string,
  name: string,
  catSlug: string,
  size: string | null,
  price: number,
  status: "available" | "sold",
  isNewDrop: boolean,
  priceMax?: number,
): ProductWithRelations {
  const category = CATEGORIES.find((c) => c.slug === catSlug)!;
  const id = `prod-${sku}`;

  return {
    id,
    slug,
    name,
    description: null,
    category_id: category.id,
    size,
    price,
    price_max: priceMax ?? null,
    status,
    is_new_drop: isNewDrop,
    drop_id: "drop-1",
    sku,
    ig_post_url: null,
    sold_at: status === "sold" ? new Date(Date.now() - 2 * 86400000).toISOString() : null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category,
    images: [img(sku, 0), img(sku, 1)],
  };
}

export const MOCK_CATEGORIES = CATEGORIES;

export const MOCK_PRODUCTS: ProductWithRelations[] = [
  product("AZQ-0001", "aesthetic-collar-longsleeve-xl", "Aesthetic Collar Longsleeve", "long-sleeves", "XL", 8500, "available", true),
  product("AZQ-0002", "vintage-quarter-zip-m", "Vintage Quarter Zip", "quarter-zips", "M", 12000, "available", true),
  product("AZQ-0003", "baggy-jeans-32", "Baggy Jeans", "jeans", "32", 18000, "available", true),
  product("AZQ-0004", "graphic-tee-l", "Graphic Tee", "tees", "L", 6500, "available", false),
  product("AZQ-0005", "aesthetic-ring-set", "Aesthetic Ring Set", "rings", "One size", 6000, "available", true, 20000),
  product("AZQ-0006", "drew-socks", "Drew Socks", "socks", "One size", 3000, "available", false),
  product("AZQ-0007", "cargo-vest-l", "Cargo Vest", "vests", "L", 15000, "available", false),
  product("AZQ-0008", "sold-hoodie-xl", "Vintage Hoodie", "hoodies", "XL", 14000, "sold", false),
];

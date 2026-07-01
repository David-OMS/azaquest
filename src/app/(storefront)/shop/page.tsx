import { ShopPageClient } from "@/components/shop/ShopPageClient";
import { getCategories, getProducts } from "@/lib/products/get-products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop | AZAQUEST",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const categories = await getCategories();

  const categoryList = params.category?.split(",").filter(Boolean);
  const sizeList = params.size?.split(",").filter(Boolean);

  const products = await getProducts({
    status: "available",
    categories: categoryList,
    sizes: sizeList,
    priceBucket: (params.price as "under-10k" | "10k-20k" | "over-20k") || null,
    sort: (params.sort as "newest" | "price-asc" | "price-desc") || "newest",
  });

  return (
    <div>
      <div className="border-b border-border px-4 py-6 sm:px-6">
        <h1 className="font-display text-2xl font-bold tracking-[0.12em] text-foreground">SHOP</h1>
      </div>
      <ShopPageClient categories={categories} products={products} />
    </div>
  );
}

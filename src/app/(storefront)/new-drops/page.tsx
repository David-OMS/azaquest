import { NewDropsPageClient } from "@/components/shop/NewDropsPageClient";
import { getCategories, getProducts } from "@/lib/products/get-products";
import { getSiteSettings } from "@/lib/site/get-settings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Drops | AZAQUEST",
};

export default async function NewDropsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const [categories, settings] = await Promise.all([
    getCategories(),
    getSiteSettings(),
  ]);

  const categoryList = params.category?.split(",").filter(Boolean);
  const sizeList = params.size?.split(",").filter(Boolean);

  const products = await getProducts({
    status: "available",
    isNewDrop: true,
    categories: categoryList,
    sizes: sizeList,
    priceBucket: (params.price as "under-10k" | "10k-20k" | "over-20k") || null,
    sort: (params.sort as "newest" | "price-asc" | "price-desc") || "newest",
  });

  return (
    <div>
      <div className="border-b border-border px-4 py-6 sm:px-6">
        <h1 className="font-display text-2xl font-bold tracking-[0.12em] text-foreground">NEW DROPS</h1>
      </div>
      <NewDropsPageClient
        categories={categories}
        products={products}
        emptyTitle={settings.empty_drop_message}
      />
    </div>
  );
}

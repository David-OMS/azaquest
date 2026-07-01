import { ProductGrid } from "@/components/shop/ProductGrid";
import { ProductGridEmpty } from "@/components/shop/ProductGridEmpty";
import { getProducts } from "@/lib/products/get-products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sold | AZAQUEST",
};

export default async function SoldPage() {
  const products = await getProducts({
    status: ["sold", "archived"],
    sort: "newest",
  });

  return (
    <div>
      <div className="border-b border-border px-4 py-6 sm:px-6">
        <h1 className="font-display text-2xl font-bold tracking-[0.12em] text-foreground">SOLD</h1>
        <p className="mt-1 text-sm text-muted">Claimed quests — proof they move fast.</p>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {products.length === 0 ? (
          <ProductGridEmpty title="Nothing claimed yet" />
        ) : (
          <ProductGrid products={products} sold />
        )}
      </div>
    </div>
  );
}

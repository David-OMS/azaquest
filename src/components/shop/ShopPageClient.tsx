"use client";

import { Suspense } from "react";
import { useShopFilters } from "@/hooks/use-shop-filters";
import { ShopLayout } from "@/components/shop/ShopLayout";
import type { Category, ProductWithRelations } from "@/types/product";

interface ShopPageClientProps {
  categories: Category[];
  products: ProductWithRelations[];
}

function ShopContent({ categories, products }: ShopPageClientProps) {
  const { filters, setFilters, clearAll, activeCount } = useShopFilters();

  return (
    <ShopLayout
      categories={categories}
      products={products}
      filters={filters}
      onFiltersChange={setFilters}
      onClearFilters={clearAll}
      activeCount={activeCount}
      emptyTitle="No quests available"
      emptyDescription="Try adjusting your filters or check back after the next drop."
    />
  );
}

export function ShopPageClient(props: ShopPageClientProps) {
  return (
    <Suspense fallback={<div className="py-16 text-center text-muted">Loading...</div>}>
      <ShopContent {...props} />
    </Suspense>
  );
}

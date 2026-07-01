"use client";

import { Suspense } from "react";
import { useShopFilters } from "@/hooks/use-shop-filters";
import { ShopLayout } from "@/components/shop/ShopLayout";
import type { Category, ProductWithRelations } from "@/types/product";

interface NewDropsPageClientProps {
  categories: Category[];
  products: ProductWithRelations[];
  emptyTitle?: string;
}

function NewDropsContent({ categories, products, emptyTitle }: NewDropsPageClientProps) {
  const { filters, setFilters, clearAll, activeCount } = useShopFilters();

  return (
    <ShopLayout
      categories={categories}
      products={products}
      filters={filters}
      onFiltersChange={setFilters}
      onClearFilters={clearAll}
      activeCount={activeCount}
      emptyTitle={emptyTitle ?? "No active quests right now."}
      emptyDescription="The next drop lands soon. Follow @azaquest on Instagram or check back."
    />
  );
}

export function NewDropsPageClient(props: NewDropsPageClientProps) {
  return (
    <Suspense fallback={<div className="py-16 text-center text-muted">Loading...</div>}>
      <NewDropsContent {...props} />
    </Suspense>
  );
}

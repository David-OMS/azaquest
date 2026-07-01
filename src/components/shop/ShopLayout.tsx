"use client";

import { useState } from "react";
import type { Category } from "@/types/product";
import type { ShopFilters } from "@/types/filters";
import { FilterSidebar } from "@/components/shop/FilterSidebar";
import { FilterChips } from "@/components/shop/FilterChips";
import { ProductGrid } from "@/components/shop/ProductGrid";
import { ProductGridEmpty } from "@/components/shop/ProductGridEmpty";
import type { ProductWithRelations } from "@/types/product";

interface ShopLayoutProps {
  categories: Category[];
  products: ProductWithRelations[];
  filters: ShopFilters;
  onFiltersChange: (filters: ShopFilters) => void;
  onClearFilters: () => void;
  activeCount: number;
  emptyTitle?: string;
  emptyDescription?: string;
  sold?: boolean;
}

export function ShopLayout({
  categories,
  products,
  filters,
  onFiltersChange,
  onClearFilters,
  activeCount,
  emptyTitle = "No quests available",
  emptyDescription,
  sold = false,
}: ShopLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const countLabel = sold
    ? `${products.length} claimed`
    : `${products.length} quest${products.length === 1 ? "" : "s"} available`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between lg:hidden">
        <p className="text-sm text-muted">{countLabel}</p>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="border border-border px-4 py-2 text-xs tracking-wider text-foreground"
        >
          FILTERS {activeCount > 0 && `(${activeCount})`}
        </button>
      </div>

      {mobileOpen && (
        <MobileFilterDrawer onClose={() => setMobileOpen(false)}>
          <FilterSidebar
            categories={categories}
            filters={filters}
            onChange={(f) => {
              onFiltersChange(f);
              setMobileOpen(false);
            }}
            onClear={onClearFilters}
            activeCount={activeCount}
          />
        </MobileFilterDrawer>
      )}

      <div className="flex gap-10">
        <div className="hidden w-[30%] shrink-0 lg:block">
          <FilterSidebar
            categories={categories}
            filters={filters}
            onChange={onFiltersChange}
            onClear={onClearFilters}
            activeCount={activeCount}
          />
        </div>

        <div className="w-full lg:w-[70%]">
          <div className="mb-6 hidden items-center justify-between lg:flex">
            <p className="text-sm text-muted">{countLabel}</p>
          </div>

          {!sold && (
            <FilterChips
              categories={categories}
              filters={filters}
              onChange={onFiltersChange}
              onClear={onClearFilters}
            />
          )}

          {products.length === 0 ? (
            <ProductGridEmpty title={emptyTitle} description={emptyDescription} />
          ) : (
            <ProductGrid products={products} sold={sold} />
          )}
        </div>
      </div>
    </div>
  );
}

function MobileFilterDrawer({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto bg-background p-6">
        <div className="mb-4 flex justify-end">
          <button type="button" onClick={onClose} className="text-sm text-muted">
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

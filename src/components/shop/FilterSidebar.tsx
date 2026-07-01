import type { Category } from "@/types/product";
import type { ShopFilters } from "@/types/filters";
import { CategoryFilter } from "@/components/shop/CategoryFilter";
import { SizeFilter } from "@/components/shop/SizeFilter";
import { PriceFilter } from "@/components/shop/PriceFilter";
import { SortSelect } from "@/components/shop/SortSelect";

interface FilterSidebarProps {
  categories: Category[];
  filters: ShopFilters;
  onChange: (filters: ShopFilters) => void;
  onClear: () => void;
  activeCount: number;
}

export function FilterSidebar({
  categories,
  filters,
  onChange,
  onClear,
  activeCount,
}: FilterSidebarProps) {
  const update = (partial: Partial<ShopFilters>) => {
    onChange({ ...filters, ...partial });
  };

  return (
    <aside className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xs font-semibold tracking-[0.35em] text-foreground">FILTERS</h2>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-muted underline-offset-2 hover:text-foreground hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <CategoryFilter
        categories={categories}
        selected={filters.categories}
        onChange={(categories) => update({ categories })}
      />

      <SizeFilter
        selected={filters.sizes}
        onChange={(sizes) => update({ sizes })}
      />

      <PriceFilter
        selected={filters.priceBucket}
        onChange={(priceBucket) => update({ priceBucket })}
      />

      <SortSelect
        value={filters.sort}
        onChange={(sort) => update({ sort })}
      />
    </aside>
  );
}

"use client";

import type { ShopFilters } from "@/types/filters";
import { PRICE_BUCKETS, SORT_OPTIONS } from "@/types/filters";
import type { Category } from "@/types/product";

interface FilterChipsProps {
  categories: Category[];
  filters: ShopFilters;
  onChange: (filters: ShopFilters) => void;
  onClear: () => void;
}

export function FilterChips({
  categories,
  filters,
  onChange,
  onClear,
}: FilterChipsProps) {
  const chips: { key: string; label: string; remove: () => void }[] = [];

  filters.categories.forEach((slug) => {
    const cat = categories.find((c) => c.slug === slug);
    chips.push({
      key: `cat-${slug}`,
      label: cat?.name ?? slug,
      remove: () =>
        onChange({
          ...filters,
          categories: filters.categories.filter((s) => s !== slug),
        }),
    });
  });

  filters.sizes.forEach((size) => {
    chips.push({
      key: `size-${size}`,
      label: size,
      remove: () =>
        onChange({
          ...filters,
          sizes: filters.sizes.filter((s) => s !== size),
        }),
    });
  });

  if (filters.priceBucket) {
    const bucket = PRICE_BUCKETS.find((b) => b.value === filters.priceBucket);
    chips.push({
      key: "price",
      label: bucket?.label ?? filters.priceBucket,
      remove: () => onChange({ ...filters, priceBucket: null }),
    });
  }

  if (filters.sort !== "newest") {
    const sort = SORT_OPTIONS.find((s) => s.value === filters.sort);
    chips.push({
      key: "sort",
      label: sort?.label ?? filters.sort,
      remove: () => onChange({ ...filters, sort: "newest" }),
    });
  }

  if (!chips.length) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.remove}
          className="flex items-center gap-1 border border-border px-3 py-1 text-xs text-foreground transition-colors hover:border-foreground"
        >
          {chip.label}
          <span className="text-muted">×</span>
        </button>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="text-xs text-muted underline-offset-2 hover:text-foreground hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}

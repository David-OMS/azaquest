export type SortOption = "newest" | "price-asc" | "price-desc";

export type PriceBucket = "under-10k" | "10k-20k" | "over-20k";

export interface ShopFilters {
  categories: string[];
  sizes: string[];
  priceBucket: PriceBucket | null;
  sort: SortOption;
}

export const DEFAULT_FILTERS: ShopFilters = {
  categories: [],
  sizes: [],
  priceBucket: null,
  sort: "newest",
};

export const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "One size"] as const;

export const PRICE_BUCKETS: { value: PriceBucket; label: string; min?: number; max?: number }[] = [
  { value: "under-10k", label: "Under ₦10k", max: 9999 },
  { value: "10k-20k", label: "₦10k – ₦20k", min: 10000, max: 20000 },
  { value: "over-20k", label: "Over ₦20k", min: 20001 },
];

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

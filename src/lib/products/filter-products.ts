import type { PriceBucket, SortOption } from "@/types/filters";
import { PRICE_BUCKETS } from "@/types/filters";
import type { ProductStatus, ProductWithRelations } from "@/types/product";

export interface ProductQueryParams {
  status?: ProductStatus | ProductStatus[];
  isNewDrop?: boolean;
  categories?: string[];
  sizes?: string[];
  priceBucket?: PriceBucket | null;
  sort?: SortOption;
}

function matchesPrice(product: ProductWithRelations, bucket: PriceBucket): boolean {
  const config = PRICE_BUCKETS.find((b) => b.value === bucket);
  if (!config) return true;

  const price = product.price;
  if (config.min !== undefined && price < config.min) return false;
  if (config.max !== undefined && price > config.max) return false;

  return true;
}

function sortProducts(products: ProductWithRelations[], sort: SortOption): ProductWithRelations[] {
  const copy = [...products];

  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    default:
      return copy.sort((a, b) => {
        const aDate = a.sold_at ?? a.created_at;
        const bDate = b.sold_at ?? b.created_at;
        return new Date(bDate).getTime() - new Date(aDate).getTime();
      });
  }
}

export function filterProducts(
  products: ProductWithRelations[],
  params: ProductQueryParams,
): ProductWithRelations[] {
  let result = [...products];

  if (params.status) {
    const statuses = Array.isArray(params.status) ? params.status : [params.status];
    result = result.filter((p) => statuses.includes(p.status));
  }

  if (params.isNewDrop) {
    result = result.filter((p) => p.is_new_drop);
  }

  if (params.categories?.length) {
    result = result.filter((p) => params.categories!.includes(p.category.slug));
  }

  if (params.sizes?.length) {
    result = result.filter((p) => p.size && params.sizes!.includes(p.size));
  }

  if (params.priceBucket) {
    result = result.filter((p) => matchesPrice(p, params.priceBucket!));
  }

  return sortProducts(result, params.sort ?? "newest");
}

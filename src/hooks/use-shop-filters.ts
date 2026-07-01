"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  DEFAULT_FILTERS,
  type PriceBucket,
  type ShopFilters,
  type SortOption,
} from "@/types/filters";

function parseList(value: string | null): string[] {
  if (!value) return [];
  return value.split(",").filter(Boolean);
}

function parseFilters(params: URLSearchParams): ShopFilters {
  return {
    categories: parseList(params.get("category")),
    sizes: parseList(params.get("size")),
    priceBucket: (params.get("price") as PriceBucket) || null,
    sort: (params.get("sort") as SortOption) || "newest",
  };
}

function buildQuery(filters: ShopFilters): string {
  const params = new URLSearchParams();

  if (filters.categories.length) {
    params.set("category", filters.categories.join(","));
  }
  if (filters.sizes.length) {
    params.set("size", filters.sizes.join(","));
  }
  if (filters.priceBucket) {
    params.set("price", filters.priceBucket);
  }
  if (filters.sort !== "newest") {
    params.set("sort", filters.sort);
  }

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function useShopFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => parseFilters(searchParams),
    [searchParams],
  );

  const setFilters = useCallback(
    (next: ShopFilters) => {
      router.push(`${pathname}${buildQuery(next)}`, { scroll: false });
    },
    [router, pathname],
  );

  const clearAll = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  const activeCount =
    filters.categories.length +
    filters.sizes.length +
    (filters.priceBucket ? 1 : 0);

  return { filters, setFilters, clearAll, activeCount, defaults: DEFAULT_FILTERS };
}

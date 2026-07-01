"use client";

import { useCallback, useEffect, useState } from "react";
import type { FavouriteItem } from "@/types/cart";

const STORAGE_KEY = "azaquest-favourites";

function readStorage(): FavouriteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FavouriteItem[]) : [];
  } catch {
    return [];
  }
}

export function useFavourites() {
  const [items, setItems] = useState<FavouriteItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStorage());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: FavouriteItem[]) => {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const isFavourite = useCallback(
    (productId: string) => items.some((i) => i.productId === productId),
    [items],
  );

  const toggle = useCallback(
    (item: FavouriteItem) => {
      const exists = items.some((i) => i.productId === item.productId);
      const next = exists
        ? items.filter((i) => i.productId !== item.productId)
        : [...items, item];
      persist(next);
    },
    [items, persist],
  );

  const remove = useCallback(
    (productId: string) => {
      persist(items.filter((i) => i.productId !== productId));
    },
    [items, persist],
  );

  return { items, hydrated, isFavourite, toggle, remove, count: items.length };
}

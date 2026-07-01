"use client";

import { useCallback, useEffect, useState } from "react";
import type { CartItem } from "@/types/cart";

const STORAGE_KEY = "azaquest-cart";

function readStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readStorage());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: CartItem[]) => {
    setItems(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const add = useCallback(
    (item: CartItem) => {
      if (items.some((i) => i.productId === item.productId)) return;
      persist([...items, item]);
    },
    [items, persist],
  );

  const remove = useCallback(
    (productId: string) => {
      persist(items.filter((i) => i.productId !== productId));
    },
    [items, persist],
  );

  const clear = useCallback(() => persist([]), [persist]);

  const hasItem = useCallback(
    (productId: string) => items.some((i) => i.productId === productId),
    [items],
  );

  return { items, hydrated, add, remove, clear, hasItem, count: items.length };
}

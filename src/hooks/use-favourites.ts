"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { FavouriteItem } from "@/types/cart";

const STORAGE_KEY = "azaquest-favourites";
const EMPTY: FavouriteItem[] = [];

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emitChange() {
  listeners.forEach((listener) => listener());
}

let cached: FavouriteItem[] = EMPTY;
let cachedRaw: string | null = null;

function getSnapshot(): FavouriteItem[] {
  if (typeof window === "undefined") return EMPTY;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cached;

  cachedRaw = raw;
  if (!raw) {
    cached = EMPTY;
    return cached;
  }

  try {
    cached = JSON.parse(raw) as FavouriteItem[];
  } catch {
    cached = EMPTY;
  }
  return cached;
}

function writeStorage(next: FavouriteItem[]) {
  const raw = JSON.stringify(next);
  localStorage.setItem(STORAGE_KEY, raw);
  cachedRaw = raw;
  cached = next.length === 0 ? EMPTY : next;
  emitChange();
}

function getServerSnapshot(): FavouriteItem[] {
  return EMPTY;
}

function getClientHydrated(): boolean {
  return true;
}

function getServerHydrated(): boolean {
  return false;
}

export function useFavourites() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(
    () => () => {},
    getClientHydrated,
    getServerHydrated,
  );

  const isFavourite = useCallback(
    (productId: string) => items.some((i) => i.productId === productId),
    [items],
  );

  const toggle = useCallback((item: FavouriteItem) => {
    const current = getSnapshot();
    const exists = current.some((i) => i.productId === item.productId);
    const next = exists
      ? current.filter((i) => i.productId !== item.productId)
      : [...current, item];
    writeStorage(next);
  }, []);

  const remove = useCallback((productId: string) => {
    writeStorage(getSnapshot().filter((i) => i.productId !== productId));
  }, []);

  return { items, hydrated, isFavourite, toggle, remove, count: items.length };
}

"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { CartItem } from "@/types/cart";

const STORAGE_KEY = "azaquest-cart";
const EMPTY: CartItem[] = [];

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emitChange() {
  listeners.forEach((listener) => listener());
}

let cached: CartItem[] = EMPTY;
let cachedRaw: string | null = null;

function getSnapshot(): CartItem[] {
  if (typeof window === "undefined") return EMPTY;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cached;

  cachedRaw = raw;
  if (!raw) {
    cached = EMPTY;
    return cached;
  }

  try {
    cached = JSON.parse(raw) as CartItem[];
  } catch {
    cached = EMPTY;
  }
  return cached;
}

function writeStorage(next: CartItem[]) {
  const raw = JSON.stringify(next);
  localStorage.setItem(STORAGE_KEY, raw);
  cachedRaw = raw;
  cached = next.length === 0 ? EMPTY : next;
  emitChange();
}

function getServerSnapshot(): CartItem[] {
  return EMPTY;
}

function getClientHydrated(): boolean {
  return true;
}

function getServerHydrated(): boolean {
  return false;
}

export function useCart() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(
    () => () => {},
    getClientHydrated,
    getServerHydrated,
  );

  const add = useCallback((item: CartItem) => {
    const current = getSnapshot();
    if (current.some((i) => i.productId === item.productId)) return;
    writeStorage([...current, item]);
  }, []);

  const remove = useCallback((productId: string) => {
    writeStorage(getSnapshot().filter((i) => i.productId !== productId));
  }, []);

  const clear = useCallback(() => writeStorage([]), []);

  const hasItem = useCallback(
    (productId: string) => items.some((i) => i.productId === productId),
    [items],
  );

  return { items, hydrated, add, remove, clear, hasItem, count: items.length };
}

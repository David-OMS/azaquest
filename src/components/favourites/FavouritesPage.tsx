"use client";

import Link from "next/link";
import { useFavourites } from "@/hooks/use-favourites";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { ProductGridEmpty } from "@/components/shop/ProductGridEmpty";

export function FavouritesPage() {
  const { items, hydrated, remove } = useFavourites();

  if (!hydrated) {
    return <div className="mx-auto max-w-2xl px-4 py-16 text-center text-muted">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="mb-8 text-xl font-medium tracking-wide text-foreground">Favourites</h1>

      {!items.length ? (
        <>
          <ProductGridEmpty
            title="No saved items"
            description="Tap the heart on any product to save it for later."
          />
          <div className="mt-8 text-center">
            <Link href="/shop" className="text-sm text-foreground underline-offset-2 hover:underline">
              Browse shop
            </Link>
          </div>
        </>
      ) : (
        <div>
          {items.map((item) => (
            <CartItemRow key={item.productId} item={item} onRemove={remove} />
          ))}
        </div>
      )}
    </div>
  );
}

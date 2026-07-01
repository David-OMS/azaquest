"use client";

import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format-price";
import { useFavourites } from "@/hooks/use-favourites";
import { useCart } from "@/hooks/use-cart";
import type { ProductWithRelations } from "@/types/product";

interface ProductCardProps {
  product: ProductWithRelations;
  sold?: boolean;
}

export function ProductCard({ product, sold = false }: ProductCardProps) {
  const { toggle, isFavourite } = useFavourites();
  const { add, hasItem } = useCart();

  const imageUrl = product.images?.[0]?.url;
  const favourite = isFavourite(product.id);
  const inCart = hasItem(product.id);

  const cartPayload = {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    size: product.size,
    price: product.price,
    priceMax: product.price_max,
    imageUrl: imageUrl ?? null,
  };

  return (
    <article className="group relative">
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-surface">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className={`object-cover transition-transform duration-300 group-hover:scale-105 ${sold ? "opacity-50" : ""}`}
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted">No image</div>
          )}
          {sold && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="border border-foreground px-4 py-1 text-xs font-medium tracking-[0.2em] text-foreground">
                CLAIMED
              </span>
            </div>
          )}
        </div>
        <div className="mt-3 space-y-1">
          <h3 className="text-sm font-medium text-foreground">{product.name}</h3>
          <p className="text-xs text-muted">
            {product.size ? `Size ${product.size}` : product.category.name}
          </p>
          <p className="text-sm text-foreground">
            {formatPrice(product.price, product.price_max)}
          </p>
        </div>
      </Link>

      {!sold && (
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => toggle(cartPayload)}
            className="text-xs text-muted transition-colors hover:text-foreground"
            aria-label={favourite ? "Remove from favourites" : "Add to favourites"}
          >
            {favourite ? "♥ Saved" : "♡ Save"}
          </button>
          <button
            type="button"
            onClick={() => add(cartPayload)}
            disabled={inCart}
            className="text-xs text-muted transition-colors hover:text-foreground disabled:opacity-40"
          >
            {inCart ? "In cart" : "+ Cart"}
          </button>
        </div>
      )}
    </article>
  );
}

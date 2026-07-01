"use client";

import Link from "next/link";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { WhatsAppCTA } from "@/components/product/WhatsAppCTA";
import { useCart } from "@/hooks/use-cart";
import { useFavourites } from "@/hooks/use-favourites";
import type { ProductWithRelations } from "@/types/product";

interface ProductDetailProps {
  product: ProductWithRelations;
  whatsappNumber: string;
}

export function ProductDetail({ product, whatsappNumber }: ProductDetailProps) {
  const sold = product.status === "sold";
  const { add, hasItem } = useCart();
  const { toggle, isFavourite } = useFavourites();

  const imageUrl = product.images?.[0]?.url ?? null;
  const payload = {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    size: product.size,
    price: product.price,
    priceMax: product.price_max,
    imageUrl,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link href="/shop" className="mb-8 inline-block text-xs text-muted hover:text-foreground">
        ← Back to shop
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery
          images={product.images ?? []}
          name={product.name}
          dimmed={sold}
        />
        <div className="flex flex-col gap-6">
          <ProductInfo product={product} sold={sold} />

          {!sold && (
            <div className="space-y-3">
              <WhatsAppCTA
                name={product.name}
                size={product.size}
                price={product.price}
                priceMax={product.price_max}
                phone={whatsappNumber}
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => add(payload)}
                  disabled={hasItem(product.id)}
                  className="flex-1 border border-border py-3 text-sm text-foreground transition-colors hover:border-foreground disabled:opacity-40"
                >
                  {hasItem(product.id) ? "In cart" : "Add to cart"}
                </button>
                <button
                  type="button"
                  onClick={() => toggle(payload)}
                  className="flex-1 border border-border py-3 text-sm text-foreground transition-colors hover:border-foreground"
                >
                  {isFavourite(product.id) ? "Saved ♥" : "Save ♡"}
                </button>
              </div>
            </div>
          )}

          {product.ig_post_url && (
            <a
              href={product.ig_post_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted underline-offset-2 hover:text-foreground hover:underline"
            >
              View on Instagram
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

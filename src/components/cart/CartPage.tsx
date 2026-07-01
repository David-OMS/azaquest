"use client";

import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { buildWhatsAppUrl, cartToWhatsAppItems } from "@/lib/whatsapp";
import { ProductGridEmpty } from "@/components/shop/ProductGridEmpty";

interface CartPageProps {
  whatsappNumber: string;
}

export function CartPage({ whatsappNumber }: CartPageProps) {
  const { items, hydrated, remove, clear } = useCart();

  if (!hydrated) {
    return <div className="mx-auto max-w-2xl px-4 py-16 text-center text-muted">Loading...</div>;
  }

  if (!items.length) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-8 text-xl font-medium tracking-wide text-foreground">Cart</h1>
        <ProductGridEmpty
          title="Your cart is empty"
          description="Add items from the shop to continue your quest."
        />
        <div className="mt-8 text-center">
          <Link href="/shop" className="text-sm text-foreground underline-offset-2 hover:underline">
            Browse shop
          </Link>
        </div>
      </div>
    );
  }

  const whatsappUrl = buildWhatsAppUrl(
    whatsappNumber,
    cartToWhatsAppItems(items),
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-xl font-medium tracking-wide text-foreground">Cart</h1>
        <button type="button" onClick={clear} className="text-xs text-muted hover:text-foreground">
          Clear all
        </button>
      </div>

      <div>
        {items.map((item) => (
          <CartItemRow key={item.productId} item={item} onRemove={remove} />
        ))}
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 block w-full border border-foreground bg-foreground py-3 text-center text-sm font-medium tracking-wider text-background transition-colors hover:bg-transparent hover:text-foreground"
      >
        Continue quest on WhatsApp
      </a>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import type { CartItem } from "@/types/cart";
import { formatPrice } from "@/lib/format-price";

interface CartItemRowProps {
  item: CartItem;
  onRemove: (id: string) => void;
}

export function CartItemRow({ item, onRemove }: CartItemRowProps) {
  return (
    <div className="flex gap-4 border-b border-border py-4">
      <Link href={`/shop/${item.slug}`} className="relative h-24 w-20 shrink-0 bg-surface">
        {item.imageUrl && (
          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="80px" />
        )}
      </Link>
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link href={`/shop/${item.slug}`} className="text-sm font-medium text-foreground hover:underline">
            {item.name}
          </Link>
          {item.size && <p className="text-xs text-muted">Size {item.size}</p>}
          <p className="text-sm text-foreground">{formatPrice(item.price, item.priceMax)}</p>
        </div>
        <button
          type="button"
          onClick={() => onRemove(item.productId)}
          className="self-start text-xs text-muted hover:text-foreground"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

"use client";

import { AdminThumb } from "@/components/admin/AdminThumb";
import Link from "next/link";
import { formatPrice } from "@/lib/format-price";
import type { ProductWithRelations } from "@/types/product";

interface AdminProductCardProps {
  product: ProductWithRelations;
  selected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onMarkSold: (id: string) => void;
}

export function AdminProductCard({
  product,
  selected,
  onSelect,
  onMarkSold,
}: AdminProductCardProps) {
  const thumb = product.images?.[0]?.url;

  return (
    <div className="border border-border p-3">
      <div className="flex gap-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onSelect(product.id, e.target.checked)}
          className="mt-1 accent-white"
        />
        <div className="relative h-16 w-12 shrink-0 bg-surface">
          {thumb && (
            <AdminThumb src={thumb} alt="" fill className="object-cover" sizes="48px" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <Link href={`/admin/products/${product.id}/edit`} className="text-sm font-medium hover:underline">
            {product.name}
          </Link>
          <p className="text-xs text-muted">{product.sku}</p>
          <p className="mt-1 text-xs">
            {product.size ?? "—"} · {formatPrice(product.price, product.price_max)}
          </p>
          <p className="mt-1 text-xs uppercase text-muted">{product.status}</p>
        </div>
      </div>
      {product.status === "available" && (
        <button
          type="button"
          onClick={() => onMarkSold(product.id)}
          className="mt-3 w-full border border-border py-2 text-xs hover:border-white"
        >
          Mark sold
        </button>
      )}
    </div>
  );
}

"use client";

import { AdminThumb } from "@/components/admin/AdminThumb";
import Link from "next/link";
import { formatPrice } from "@/lib/format-price";
import type { ProductWithRelations } from "@/types/product";

interface AdminProductRowProps {
  product: ProductWithRelations;
  selected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onMarkSold: (id: string) => void;
}

const STATUS_STYLES: Record<string, string> = {
  available: "text-green-400",
  sold: "text-muted",
  draft: "text-yellow-400",
  archived: "text-muted",
};

export function AdminProductRow({
  product,
  selected,
  onSelect,
  onMarkSold,
}: AdminProductRowProps) {
  const thumb = product.images?.[0]?.url;

  return (
    <tr className="border-b border-border">
      <td className="py-3 pr-2">
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onSelect(product.id, e.target.checked)}
          className="accent-white"
        />
      </td>
      <td className="py-3 pr-4">
        <div className="relative h-14 w-11 bg-surface">
          {thumb && (
            <AdminThumb src={thumb} alt="" fill className="object-cover" sizes="44px" />
          )}
        </div>
      </td>
      <td className="py-3 pr-4">
        <Link href={`/admin/products/${product.id}/edit`} className="text-sm hover:underline">
          {product.name}
        </Link>
        <p className="text-xs text-muted">{product.sku}</p>
      </td>
      <td className="py-3 pr-4 text-sm text-muted">{product.size ?? "—"}</td>
      <td className="py-3 pr-4 text-sm">{formatPrice(product.price, product.price_max)}</td>
      <td className={`py-3 pr-4 text-xs uppercase ${STATUS_STYLES[product.status]}`}>
        {product.status}
      </td>
      <td className="py-3">
        {product.status === "available" && (
          <button
            type="button"
            onClick={() => onMarkSold(product.id)}
            className="text-xs text-muted hover:text-white"
          >
            Mark sold
          </button>
        )}
      </td>
    </tr>
  );
}

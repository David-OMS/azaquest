"use client";

import { AdminProductImageList } from "@/components/admin/AdminProductImageList";
import type { ProductWithRelations } from "@/types/product";

interface AdminProductPhotosProps {
  product: ProductWithRelations;
  onRefresh: () => void;
}

export function AdminProductPhotos({ product, onRefresh }: AdminProductPhotosProps) {
  return (
    <section className="mb-10 max-w-xl border border-border p-4 sm:p-6">
      <h2 className="text-sm font-medium tracking-[0.15em]">PRODUCT PHOTOS</h2>
      <p className="mt-2 mb-4 text-sm text-muted">
        First image is the shop thumbnail. Label each photo (e.g. front, back, tag).
      </p>
      <AdminProductImageList
        productId={product.id}
        images={(product.images ?? []).map((i) => ({
          id: i.id,
          url: i.url,
          alt: i.alt,
        }))}
        onUpdated={onRefresh}
      />
    </section>
  );
}

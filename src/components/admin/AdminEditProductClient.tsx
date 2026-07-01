"use client";

import { useRouter } from "next/navigation";
import { AdminProductPhotos } from "@/components/admin/AdminProductPhotos";
import { AdminProductForm } from "@/components/admin/AdminProductForm";
import type { Category, ProductWithRelations } from "@/types/product";

interface AdminEditProductClientProps {
  product: ProductWithRelations;
  categories: Category[];
}

export function AdminEditProductClient({
  product,
  categories,
}: AdminEditProductClientProps) {
  const router = useRouter();

  return (
    <>
      <AdminProductPhotos product={product} onRefresh={() => router.refresh()} />
      <section className="max-w-xl">
        <h2 className="mb-4 text-sm font-medium tracking-[0.15em]">PRODUCT DETAILS</h2>
        <AdminProductForm categories={categories} product={product} />
      </section>
    </>
  );
}

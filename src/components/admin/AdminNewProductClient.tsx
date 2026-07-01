"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdminStagedImages } from "@/components/admin/AdminStagedImages";
import { AdminProductForm } from "@/components/admin/AdminProductForm";
import type { StagedImage } from "@/types/admin-images";

async function uploadStagedImages(productId: string, images: StagedImage[]) {
  const form = new FormData();
  form.append("productId", productId);
  for (const img of images) {
    form.append("files", img.file);
    form.append("alts", img.label.trim());
  }

  const res = await fetch("/api/admin/uploads/batch", { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Image upload failed");
  }
}

export function AdminNewProductClient() {
  const router = useRouter();
  const [stagedImages, setStagedImages] = useState<StagedImage[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleCreated = async (productId: string) => {
    setUploading(true);
    try {
      await uploadStagedImages(productId, stagedImages);
      router.push(`/admin/products/${productId}/edit`);
    } catch (err) {
      setUploading(false);
      throw new Error(
        `${err instanceof Error ? err.message : "Upload failed"} — product was saved; finish photos on the edit screen.`,
      );
    }
  };

  return (
    <div className="max-w-xl space-y-8">
      <AdminStagedImages images={stagedImages} onChange={setStagedImages} />

      <section>
        <h2 className="mb-4 text-sm font-medium tracking-[0.15em]">PRODUCT DETAILS</h2>
        <AdminProductForm
          stagedImages={stagedImages}
          uploadingImages={uploading}
          onCreated={handleCreated}
        />
      </section>
    </div>
  );
}

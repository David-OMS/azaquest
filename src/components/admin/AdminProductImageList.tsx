"use client";

import { useEffect, useState } from "react";
import { AdminThumb } from "@/components/admin/AdminThumb";

interface PersistedImage {
  id: string;
  url: string;
  alt: string | null;
}

interface AdminProductImageListProps {
  productId: string;
  images: PersistedImage[];
  onUpdated: () => void;
}

export function AdminProductImageList({
  productId,
  images,
  onUpdated,
}: AdminProductImageListProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [labels, setLabels] = useState<Record<string, string>>(() =>
    Object.fromEntries(images.map((img) => [img.id, img.alt ?? ""])),
  );

  useEffect(() => {
    setLabels(Object.fromEntries(images.map((img) => [img.id, img.alt ?? ""])));
  }, [images]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    setError(null);

    const form = new FormData();
    form.append("productId", productId);
    for (const file of Array.from(files)) {
      form.append("files", file);
      form.append("alts", file.name.replace(/\.[^.]+$/, ""));
    }

    const res = await fetch("/api/admin/uploads/batch", { method: "POST", body: form });
    const data = await res.json();
    setUploading(false);

    if (!res.ok) {
      setError(data.error ?? "Upload failed");
      return;
    }

    onUpdated();
  };

  const saveLabel = async (imageId: string) => {
    const alt = labels[imageId] ?? "";
    await fetch(`/api/admin/products/${productId}/images/${imageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alt }),
    });
  };

  const handleDelete = async (imageId: string, url: string) => {
    const res = await fetch(
      `/api/admin/products/${productId}/images/${imageId}?url=${encodeURIComponent(url)}`,
      { method: "DELETE" },
    );
    if (res.ok) onUpdated();
  };

  return (
    <div>
      {images.length > 0 && (
        <div className="space-y-4">
          {images.map((img, index) => (
            <div key={img.id} className="flex gap-3 border border-border p-3">
              <div className="relative h-28 w-20 shrink-0 bg-surface">
                <AdminThumb src={img.url} alt={labels[img.id] || ""} fill className="object-cover" sizes="80px" />
                {index === 0 && (
                  <span className="absolute bottom-0 left-0 bg-black/80 px-1 text-[10px] text-white">
                    Cover
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <label className="block text-xs text-muted">
                  Label
                  <input
                    value={labels[img.id] ?? ""}
                    onChange={(e) =>
                      setLabels((prev) => ({ ...prev, [img.id]: e.target.value }))
                    }
                    onBlur={() => saveLabel(img.id)}
                    placeholder="Front, back, detail..."
                    className="mt-1 w-full border border-border bg-surface px-2 py-1.5 text-sm outline-none focus:border-white"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => handleDelete(img.id, img.url)}
                  className="text-xs text-muted hover:text-white"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <input
          type="file"
          accept="image/*"
          multiple
          disabled={uploading}
          onChange={handleUpload}
          className="text-sm text-muted"
        />
        {uploading && <p className="mt-2 text-xs text-muted">Uploading...</p>}
        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      </div>
    </div>
  );
}

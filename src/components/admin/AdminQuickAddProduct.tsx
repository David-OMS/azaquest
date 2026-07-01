"use client";

import { useEffect, useState } from "react";
import { fetchWithTimeout } from "@/lib/fetch-timeout";
import { newId } from "@/lib/new-id";
import { resolveProductSize } from "@/lib/product-size";
import { ProductSizeFields } from "@/components/admin/ProductSizeFields";
import type { StagedImage } from "@/types/admin-images";
import type { Category } from "@/types/product";

async function createAndUpload(
  payload: Record<string, unknown>,
  images: StagedImage[],
) {
  const res = await fetchWithTimeout("/api/admin/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }, 15000);

  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Could not save product");

  const form = new FormData();
  form.append("productId", data.product.id);
  for (const img of images) {
    form.append("files", img.file);
    form.append("alts", "");
  }

  const uploadRes = await fetch("/api/admin/uploads/batch", { method: "POST", body: form });
  const uploadData = await uploadRes.json();
  if (!uploadRes.ok) {
    throw new Error(
      `${uploadData.error ?? "Photo upload failed"} — product saved, add photos from Products list.`,
    );
  }

  return data.product.id as string;
}

function PhotoPicker({
  onFiles,
  className,
}: {
  onFiles: (files: FileList | null) => void;
  className?: string;
}) {
  return (
    <label
      className={`relative flex cursor-pointer items-center justify-center border-2 border-dashed border-border bg-surface text-3xl text-muted transition-colors hover:border-white hover:text-foreground ${className ?? ""}`}
    >
      <input
        type="file"
        accept="image/*"
        multiple
        className="absolute inset-0 z-10 cursor-pointer opacity-0"
        onChange={(e) => {
          onFiles(e.target.files);
          e.target.value = "";
        }}
      />
      +
    </label>
  );
}

export function AdminQuickAddProduct() {
  const [images, setImages] = useState<StagedImage[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [size, setSize] = useState("");
  const [waist, setWaist] = useState("");
  const [length, setLength] = useState("");
  const [price, setPrice] = useState("");
  const [isNewDrop, setIsNewDrop] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchWithTimeout("/api/categories", undefined, 8000)
      .then((r) => r.json())
      .then((d) => {
        setCategories(d.categories ?? []);
        setCategoryId(d.categories?.[0]?.id ?? "");
      })
      .catch(() => setMessage("Could not load categories"));
  }, []);

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;
    setMessage(null);
    const added = Array.from(files).map((file) => ({
      id: newId(),
      file,
      previewUrl: URL.createObjectURL(file),
      label: "",
    }));
    setImages((prev) => [...prev, ...added]);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const clearForm = () => {
    setImages((prev) => {
      prev.forEach((img) => URL.revokeObjectURL(img.previewUrl));
      return [];
    });
    setName("");
    setSize("");
    setWaist("");
    setLength("");
    setPrice("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!images.length) {
      setMessage("Add a photo first.");
      return;
    }
    if (!categoryId) {
      setMessage("Wait a moment and try again.");
      return;
    }

    const resolvedSize = resolveProductSize(categories, categoryId, size, waist, length);
    if (resolvedSize.error) {
      setMessage(resolvedSize.error);
      return;
    }

    if (!Number.isFinite(Number(price)) || Number(price) < 0) {
      setMessage("Enter a valid price.");
      return;
    }

    setBusy(true);
    setMessage(null);

    try {
      await createAndUpload(
        {
          name,
          category_id: categoryId,
          size: resolvedSize.value,
          price: Number(price),
          status: "available",
          is_new_drop: isNewDrop,
        },
        images,
      );
      clearForm();
      setMessage("Saved");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-5">
      {images.length === 0 ? (
        <PhotoPicker onFiles={addFiles} className="aspect-[3/4]" />
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {images.map((img, index) => (
            <div key={img.id} className="relative aspect-[3/4] overflow-hidden bg-surface">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.previewUrl}
                alt={`Preview ${index + 1}`}
                className="h-full w-full object-cover"
              />
              {index === 0 && (
                <span className="absolute left-1 top-1 bg-black/70 px-1.5 py-0.5 text-[10px] text-white">
                  Cover
                </span>
              )}
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="absolute right-1 top-1 z-20 bg-black/70 px-2 py-0.5 text-xs text-white hover:bg-black"
              >
                ×
              </button>
            </div>
          ))}
          <PhotoPicker onFiles={addFiles} className="aspect-[3/4]" />
        </div>
      )}

      <div className="space-y-3">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product name"
          className="w-full border border-border bg-surface px-3 py-3 text-sm outline-none focus:border-white"
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full border border-border bg-surface px-3 py-3 text-sm outline-none focus:border-white"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <ProductSizeFields
          categories={categories}
          categoryId={categoryId}
          size={size}
          waist={waist}
          length={length}
          onSizeChange={setSize}
          onWaistChange={setWaist}
          onLengthChange={setLength}
        />
        <input
          required
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price ₦"
          className="w-full border border-border bg-surface px-3 py-3 text-sm outline-none focus:border-white"
        />
        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={isNewDrop}
            onChange={(e) => setIsNewDrop(e.target.checked)}
            className="accent-white"
          />
          Include in new drops
        </label>
      </div>

      <button
        type="submit"
        disabled={busy || !images.length}
        className="w-full border border-white bg-white py-3 text-sm font-medium tracking-wide text-black hover:bg-transparent hover:text-white disabled:opacity-40"
      >
        {busy ? "Saving..." : "Save & next"}
      </button>

      {message && (
        <p className={`text-center text-sm ${message === "Saved" ? "text-green-400" : "text-red-400"}`}>
          {message}
        </p>
      )}
    </form>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { fetchWithTimeout } from "@/lib/fetch-timeout";
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

export function AdminQuickAddProduct() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<StagedImage[]>([]);
  const imagesRef = useRef<StagedImage[]>([]);
  imagesRef.current = images;

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [size, setSize] = useState("");
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

  useEffect(() => {
    return () => imagesRef.current.forEach((img) => URL.revokeObjectURL(img.previewUrl));
  }, []);

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;
    setMessage(null);
    setImages((prev) => [
      ...prev,
      ...Array.from(files).map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
        label: "",
      })),
    ]);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const clearForm = () => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    setName("");
    setSize("");
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

    setBusy(true);
    setMessage(null);

    try {
      await createAndUpload(
        {
          name,
          category_id: categoryId,
          size: size || null,
          price: Number(price),
          status: "available",
          is_new_drop: isNewDrop,
        },
        images,
      );
      clearForm();
      setMessage("Saved");
      inputRef.current?.focus();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-5">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {images.length === 0 ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex aspect-[3/4] w-full items-center justify-center border-2 border-dashed border-border bg-surface text-3xl text-muted transition-colors hover:border-white hover:text-foreground"
        >
          +
        </button>
      ) : (
        <div className="space-y-2">
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
                  className="absolute right-1 top-1 bg-black/70 px-2 py-0.5 text-xs text-white hover:bg-black"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex aspect-[3/4] items-center justify-center border border-dashed border-border text-2xl text-muted hover:border-white hover:text-foreground"
            >
              +
            </button>
          </div>
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
        <div className="grid grid-cols-2 gap-3">
          <input
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="Size (XL, M...)"
            className="w-full border border-border bg-surface px-3 py-3 text-sm outline-none focus:border-white"
          />
          <input
            required
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price ₦"
            className="w-full border border-border bg-surface px-3 py-3 text-sm outline-none focus:border-white"
          />
        </div>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full border border-border bg-surface px-3 py-3 text-sm outline-none focus:border-white"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
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
        <p className={`text-center text-sm ${message.startsWith("Saved") ? "text-green-400" : "text-muted"}`}>
          {message}
        </p>
      )}
    </form>
  );
}

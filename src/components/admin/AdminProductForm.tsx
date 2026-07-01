"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchWithTimeout } from "@/lib/fetch-timeout";
import type { Category, ProductWithRelations } from "@/types/product";
import type { ProductStatus } from "@/types/product";

import type { StagedImage } from "@/types/admin-images";

interface AdminProductFormProps {
  categories?: Category[];
  product?: ProductWithRelations;
  stagedImages?: StagedImage[];
  uploadingImages?: boolean;
  onCreated?: (productId: string) => Promise<void>;
}

const STATUSES: ProductStatus[] = ["draft", "available", "sold", "archived"];

export function AdminProductForm({
  categories: initialCategories,
  product,
  stagedImages,
  uploadingImages = false,
  onCreated,
}: AdminProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(product);
  const imagesFirstFlow = !isEdit && stagedImages !== undefined;

  const [categories, setCategories] = useState<Category[]>(initialCategories ?? []);
  const [loadingCategories, setLoadingCategories] = useState(!initialCategories?.length);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [categoryId, setCategoryId] = useState(product?.category_id ?? categories[0]?.id ?? "");
  const [size, setSize] = useState(product?.size ?? "");
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [priceMax, setPriceMax] = useState(product?.price_max ? String(product.price_max) : "");
  const [status, setStatus] = useState<ProductStatus>(product?.status ?? "available");
  const [isNewDrop, setIsNewDrop] = useState(product?.is_new_drop ?? false);
  const [igUrl, setIgUrl] = useState(product?.ig_post_url ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialCategories?.length) return;

    let cancelled = false;

    (async () => {
      try {
        const res = await fetchWithTimeout("/api/categories", undefined, 8000);
        const data = await res.json();
        if (cancelled) return;

        if (!res.ok || !data.categories?.length) {
          setCategoriesError("Could not load categories. Check Supabase connection.");
          return;
        }

        setCategories(data.categories);
        setCategoryId((prev) => prev || data.categories[0].id);
      } catch {
        if (!cancelled) {
          setCategoriesError("Database timed out. Check your connection and try again.");
        }
      } finally {
        if (!cancelled) setLoadingCategories(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [initialCategories]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) {
      setError("Select a category first");
      return;
    }

    if (imagesFirstFlow && !stagedImages?.length) {
      setError("Add at least one image above");
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      name,
      description: description || null,
      category_id: categoryId,
      size: size || null,
      price: Number(price),
      price_max: priceMax ? Number(priceMax) : null,
      status,
      is_new_drop: isNewDrop,
      ig_post_url: igUrl || null,
    };

    const url = isEdit ? `/api/admin/products/${product!.id}` : "/api/admin/products";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetchWithTimeout(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }, 15000);

      const data = await res.json();

      if (!res.ok) {
        setSaving(false);
        setError(data.error ?? "Save failed");
        return;
      }

      if (!isEdit && onCreated) {
        try {
          await onCreated(data.product.id);
        } catch (err) {
          setSaving(false);
          setError(err instanceof Error ? err.message : "Image upload failed");
          return;
        }
        return;
      }

      setSaving(false);

      if (!isEdit) {
        router.push(`/admin/products/${data.product.id}/edit`);
        return;
      }

      router.refresh();
    } catch {
      setSaving(false);
      setError("Request timed out. Check SUPABASE_SERVICE_ROLE_KEY in .env.local and restart dev.");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      {!isEdit && !imagesFirstFlow && (
        <div className="border border-border bg-surface p-4 text-sm text-muted">
          Step 1 of 2 — enter product details, then upload photos on the next screen.
        </div>
      )}

      {loadingCategories && (
        <p className="text-sm text-muted">Loading categories...</p>
      )}

      {categoriesError && (
        <p className="text-sm text-red-400">{categoriesError}</p>
      )}

      <div>
        <label className="mb-1 block text-xs text-muted">Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-white"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-muted">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs text-muted">Category</label>
          <select
            required
            disabled={loadingCategories || !categories.length}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border border-border bg-surface px-3 py-2 text-sm disabled:opacity-50"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">Size</label>
          <input
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="XL, M, One size"
            className="w-full border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs text-muted">Price (₦)</label>
          <input
            required
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-white"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">Max price (optional)</label>
          <input
            type="number"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs text-muted">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ProductStatus)}
            className="w-full border border-border bg-surface px-3 py-2 text-sm"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <label className="flex items-end gap-2 pb-2 text-sm">
          <input
            type="checkbox"
            checked={isNewDrop}
            onChange={(e) => setIsNewDrop(e.target.checked)}
            className="accent-white"
          />
          New drop
        </label>
      </div>

      <div>
        <label className="mb-1 block text-xs text-muted">Instagram post URL</label>
        <input
          type="url"
          value={igUrl}
          onChange={(e) => setIgUrl(e.target.value)}
          className="w-full border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-white"
        />
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={saving || uploadingImages || loadingCategories || !categories.length}
        className="border border-white bg-white px-6 py-2 text-sm font-medium text-black hover:bg-transparent hover:text-white disabled:opacity-50"
      >
        {uploadingImages
          ? "Uploading images..."
          : saving
            ? "Saving..."
            : isEdit
              ? "Save changes"
              : "Create product"}
      </button>
    </form>
  );
}

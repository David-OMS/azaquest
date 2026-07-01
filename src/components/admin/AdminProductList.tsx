"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AdminProductCard } from "@/components/admin/AdminProductCard";
import { AdminProductRow } from "@/components/admin/AdminProductRow";
import type { ProductStatus, ProductWithRelations } from "@/types/product";

export function AdminProductList() {
  const [products, setProducts] = useState<ProductWithRelations[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProductStatus | "">("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (status) params.set("status", status);

    const res = await fetch(`/api/admin/products?${params}`);
    const data = await res.json();
    setProducts(data.products ?? []);
    setLoading(false);
  }, [search, status]);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const markSold = async (ids: string[]) => {
    const res = await fetch("/api/admin/products/bulk-sold", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    if (!res.ok) {
      setMessage("Failed to mark sold");
      return;
    }
    setMessage(`Marked ${ids.length} as sold`);
    setSelected(new Set());
    fetchProducts();
  };

  const toggleSelect = (id: string, checked: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-medium">Products</h1>
        </div>
        <Link
          href="/admin/products/new"
          className="border border-white px-4 py-2 text-xs tracking-wider hover:bg-white hover:text-black"
        >
          + Add product
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Search name, SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-[200px] flex-1 border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-white"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ProductStatus | "")}
          className="border border-border bg-surface px-3 py-2 text-sm outline-none"
        >
          <option value="">All statuses</option>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
          <option value="draft">Draft</option>
        </select>
        {selected.size > 0 && (
          <button
            type="button"
            onClick={() => markSold([...selected])}
            className="border border-white px-4 py-2 text-xs hover:bg-white hover:text-black"
          >
            Mark {selected.size} sold
          </button>
        )}
      </div>

      {message && <p className="mb-4 text-sm text-muted">{message}</p>}

      {loading ? (
        <p className="text-sm text-muted">Loading...</p>
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {products.map((product) => (
              <AdminProductCard
                key={product.id}
                product={product}
                selected={selected.has(product.id)}
                onSelect={toggleSelect}
                onMarkSold={(id) => markSold([id])}
              />
            ))}
            {!products.length && (
              <p className="py-12 text-center text-sm text-muted">No products found</p>
            )}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border text-xs text-muted">
                <th className="pb-2 pr-2" />
                <th className="pb-2 pr-4">Image</th>
                <th className="pb-2 pr-4">Name</th>
                <th className="pb-2 pr-4">Size</th>
                <th className="pb-2 pr-4">Price</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <AdminProductRow
                  key={product.id}
                  product={product}
                  selected={selected.has(product.id)}
                  onSelect={toggleSelect}
                  onMarkSold={(id) => markSold([id])}
                />
              ))}
            </tbody>
          </table>
          {!products.length && (
            <p className="py-12 text-center text-sm text-muted">No products found</p>
          )}
          </div>
        </>
      )}
    </div>
  );
}

import { NextResponse } from "next/server";
import { getCategories, getProducts } from "@/lib/products/get-products";
import type { PriceBucket, SortOption } from "@/types/filters";
import type { ProductStatus } from "@/types/product";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const status = (searchParams.get("status") ?? "available") as ProductStatus;
  const isNewDrop = searchParams.get("newDrop") === "true";
  const categories = searchParams.get("category")?.split(",").filter(Boolean);
  const sizes = searchParams.get("size")?.split(",").filter(Boolean);
  const priceBucket = searchParams.get("price") as PriceBucket | null;
  const sort = (searchParams.get("sort") as SortOption) || "newest";

  const products = await getProducts({
    status,
    isNewDrop: isNewDrop || undefined,
    categories,
    sizes,
    priceBucket,
    sort,
  });

  return NextResponse.json({ products, count: products.length });
}

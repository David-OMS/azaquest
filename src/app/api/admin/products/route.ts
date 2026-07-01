import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import {
  createProduct,
  listAdminProducts,
} from "@/lib/admin/product-service";
import { formatDbError } from "@/lib/admin/format-db-error";
import { revalidateStorefront } from "@/lib/revalidate-storefront";
import type { ProductStatus } from "@/types/product";

export async function GET(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("q") ?? undefined;
  const status = (searchParams.get("status") as ProductStatus) || undefined;

  try {
    const products = await listAdminProducts(search, status);
    return NextResponse.json({ products });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to list products";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const product = await createProduct(body);
    try {
      revalidateStorefront(product.slug);
    } catch {
      // Storefront cache bust is best-effort; product was still created.
    }
    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    const message = formatDbError(err, "Failed to create product");
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

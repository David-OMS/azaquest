import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { markProductsSold } from "@/lib/admin/product-service";
import { revalidateStorefront } from "@/lib/revalidate-storefront";

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { ids } = await request.json();
    if (!Array.isArray(ids) || !ids.length) {
      return NextResponse.json({ error: "ids required" }, { status: 400 });
    }

    const products = await markProductsSold(ids);
    revalidateStorefront();
    return NextResponse.json({ products, count: products.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to mark sold";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products/get-products";

export async function GET() {
  const products = await getProducts({
    status: "available",
    isNewDrop: true,
    sort: "newest",
  });

  return NextResponse.json({ products, count: products.length });
}

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { addProductImage } from "@/lib/admin/product-service";
import { uploadProductImage } from "@/lib/r2/upload";

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const form = await request.formData();
    const file = form.get("file") as File | null;
    const productId = form.get("productId") as string | null;

    if (!file || !productId) {
      return NextResponse.json({ error: "file and productId required" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const alt = (form.get("alt") as string | null)?.trim() || null;
    const url = await uploadProductImage(buffer, file.name);
    const image = await addProductImage(productId, url, alt);

    return NextResponse.json({ image, url }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

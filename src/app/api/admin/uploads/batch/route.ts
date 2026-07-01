import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require-admin";
import { addProductImage, getAdminProduct } from "@/lib/admin/product-service";
import { revalidateStorefront } from "@/lib/revalidate-storefront";
import { uploadProductImage } from "@/lib/r2/upload";
export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const form = await request.formData();
    const productId = form.get("productId") as string | null;
    const files = form.getAll("files").filter((f): f is File => f instanceof File);

    if (!productId || !files.length) {
      return NextResponse.json({ error: "productId and files required" }, { status: 400 });
    }

    const alts = form.getAll("alts").map((a) => (typeof a === "string" ? a : ""));

    const images = await Promise.all(
      files.map(async (file, index) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const url = await uploadProductImage(buffer, file.name);
        return addProductImage(productId, url, alts[index] || null);      }),
    );

    const product = await getAdminProduct(productId);
    revalidateStorefront(product.slug);

    return NextResponse.json({ images }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Batch upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

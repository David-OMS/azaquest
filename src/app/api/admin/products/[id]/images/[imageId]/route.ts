import { NextResponse } from "next/server";
import { removeProductImage, updateProductImageAlt } from "@/lib/admin/product-service";
import { deleteR2Object } from "@/lib/r2/upload";
import { requireAdmin } from "@/lib/auth/require-admin";

interface RouteParams {
  params: Promise<{ id: string; imageId: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { imageId } = await params;
    const body = await request.json();
    const alt = typeof body.alt === "string" ? body.alt : null;
    const image = await updateProductImageAlt(imageId, alt);
    return NextResponse.json({ image });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update image";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { imageId } = await params;
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "url required" }, { status: 400 });
    }

    await removeProductImage(imageId, url);
    await deleteR2Object(url);

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete image";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

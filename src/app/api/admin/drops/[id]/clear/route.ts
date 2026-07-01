import { NextResponse } from "next/server";
import { clearDrop } from "@/lib/admin/drop-service";
import { requireAdmin } from "@/lib/auth/require-admin";
import { revalidateStorefront } from "@/lib/revalidate-storefront";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const result = await clearDrop(id);
    revalidateStorefront();
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to clear drop";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

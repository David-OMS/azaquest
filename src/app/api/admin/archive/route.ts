import { NextResponse } from "next/server";
import { exportProductMetadata, runArchiveCleanup } from "@/lib/admin/archive-service";
import { requireAdmin } from "@/lib/auth/require-admin";

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json().catch(() => ({}));
    const action = body.action as string;

    if (action === "export") {
      const result = await exportProductMetadata();
      return NextResponse.json(result);
    }

    const result = await runArchiveCleanup();
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Archive action failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

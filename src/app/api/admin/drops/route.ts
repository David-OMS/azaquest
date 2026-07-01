import { NextResponse } from "next/server";
import {
  clearDrop,
  getActiveDrop,
  listRecentDrops,
  startNewDrop,
} from "@/lib/admin/drop-service";
import { requireAdmin } from "@/lib/auth/require-admin";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const [active, recent] = await Promise.all([getActiveDrop(), listRecentDrops()]);
    return NextResponse.json({ active, recent });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load drops";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const name = typeof body.name === "string" && body.name.trim()
      ? body.name.trim()
      : `Drop — ${new Date().toLocaleDateString("en-NG", { month: "short", day: "numeric" })}`;

    const drop = await startNewDrop(name);
    return NextResponse.json({ drop });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to start drop";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

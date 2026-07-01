import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/ssr-server";

export function getAdminEmail(): string | null {
  return process.env.ADMIN_EMAIL ?? null;
}

export async function getSessionUser() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function requireAdmin() {
  const adminEmail = getAdminEmail();
  if (!adminEmail) {
    return { error: NextResponse.json({ error: "Admin not configured" }, { status: 500 }) };
  }

  const user = await getSessionUser();
  if (!user) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  if (user.email?.toLowerCase() !== adminEmail.toLowerCase()) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { user };
}

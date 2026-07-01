import { createServiceClient } from "@/lib/supabase/service";

export interface AdminStats {
  available: number;
  sold: number;
  soldThisWeek: number;
  newDrops: number;
  archiveReady: number;
  draft: number;
}

function getClient() {
  const client = createServiceClient();
  if (!client) throw new Error("Database not configured");
  return client;
}

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = getClient();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const archiveCutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [
    available,
    sold,
    soldWeek,
    newDrops,
    draft,
    archiveReady,
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }).eq("status", "available"),
    supabase.from("products").select("*", { count: "exact", head: true }).eq("status", "sold"),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("status", "sold")
      .gte("sold_at", weekAgo),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_new_drop", true)
      .eq("status", "available"),
    supabase.from("products").select("*", { count: "exact", head: true }).eq("status", "draft"),
    supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("status", "sold")
      .lt("sold_at", archiveCutoff),
  ]);

  return {
    available: available.count ?? 0,
    sold: sold.count ?? 0,
    soldThisWeek: soldWeek.count ?? 0,
    newDrops: newDrops.count ?? 0,
    draft: draft.count ?? 0,
    archiveReady: archiveReady.count ?? 0,
  };
}

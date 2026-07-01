import { createServiceClient } from "@/lib/supabase/service";

export interface Drop {
  id: string;
  name: string;
  released_at: string;
  is_active: boolean;
  created_at: string;
}

function getClient() {
  const client = createServiceClient();
  if (!client) throw new Error("Database not configured");
  return client;
}

export async function getActiveDrop(): Promise<Drop | null> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("drops")
    .select("*")
    .eq("is_active", true)
    .order("released_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as Drop | null;
}

export async function listRecentDrops(limit = 8): Promise<Drop[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("drops")
    .select("*")
    .order("released_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as Drop[];
}

export async function startNewDrop(name: string): Promise<Drop> {
  const supabase = getClient();

  await supabase.from("drops").update({ is_active: false }).eq("is_active", true);

  const { data, error } = await supabase
    .from("drops")
    .insert({ name, is_active: true })
    .select()
    .single();

  if (error) throw error;
  return data as Drop;
}

export async function clearDrop(dropId: string): Promise<{ cleared: number }> {
  const supabase = getClient();

  const { error: dropError } = await supabase
    .from("drops")
    .update({ is_active: false })
    .eq("id", dropId);

  if (dropError) throw dropError;

  const { data, error } = await supabase
    .from("products")
    .update({ is_new_drop: false })
    .or(`drop_id.eq.${dropId},is_new_drop.eq.true`)
    .select("id");

  if (error) throw error;
  return { cleared: data?.length ?? 0 };
}

export async function getActiveDropId(): Promise<string | null> {
  const drop = await getActiveDrop();
  return drop?.id ?? null;
}

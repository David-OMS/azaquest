import { createServiceClient } from "@/lib/supabase/service";
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export interface SiteSettings {
  hero_video_url: string | null;
  hero_punchline: string;
  whatsapp_number: string | null;
  ig_handle: string;
  empty_drop_message: string;
}

const DEFAULTS: SiteSettings = {
  hero_video_url: null,
  hero_punchline: "EVERY QUEST HAS A REWARD.",
  whatsapp_number: null,
  ig_handle: "azaquest",
  empty_drop_message: "No active quests right now.",
};

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) return DEFAULTS;

  const supabase = createServerClient();
  if (!supabase) return DEFAULTS;

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error || !data) return DEFAULTS;
  return data as SiteSettings;
}

export async function updateSiteSettings(
  patch: Partial<SiteSettings>,
): Promise<SiteSettings> {
  const supabase = createServiceClient();
  if (!supabase) throw new Error("Database not configured");

  const { data, error } = await supabase
    .from("site_settings")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", 1)
    .select()
    .single();

  if (error) throw error;
  return data as SiteSettings;
}

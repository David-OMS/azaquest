import { createServiceClient } from "@/lib/supabase/service";

export async function generateSku(): Promise<string> {
  const supabase = createServiceClient();
  if (!supabase) return `AZQ-${Date.now().toString().slice(-4)}`;

  const { count } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  const next = (count ?? 0) + 1;
  return `AZQ-${String(next).padStart(4, "0")}`;
}

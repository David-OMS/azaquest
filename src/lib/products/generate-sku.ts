import { createServiceClient } from "@/lib/supabase/service";

const SKU_PATTERN = /^AZQ-(\d+)$/i;

export async function generateSku(): Promise<string> {
  const supabase = createServiceClient();
  if (!supabase) return `AZQ-${Date.now().toString().slice(-6)}`;

  const { data, error } = await supabase
    .from("products")
    .select("sku")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error || !data?.length) return "AZQ-0001";

  let max = 0;
  for (const row of data) {
    const match = SKU_PATTERN.exec(row.sku ?? "");
    if (match) max = Math.max(max, Number(match[1]));
  }

  return `AZQ-${String(max + 1).padStart(4, "0")}`;
}

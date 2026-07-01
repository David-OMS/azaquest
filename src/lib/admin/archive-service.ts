import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { deleteR2Object } from "@/lib/r2/upload";
import { createServiceClient } from "@/lib/supabase/service";

const PRODUCT_EXPORT_SELECT = `
  id, slug, name, sku, size, price, price_max, status,
  sold_at, created_at, updated_at, ig_post_url, ig_caption_snippet,
  category:categories(name, slug)
`;

function getClient() {
  const client = createServiceClient();
  if (!client) throw new Error("Database not configured");
  return client;
}

export async function getArchiveCandidateCount(): Promise<number> {
  const supabase = getClient();
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { count, error } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("status", "sold")
    .lt("sold_at", cutoff);

  if (error) throw error;
  return count ?? 0;
}

export async function runArchiveCleanup(): Promise<{
  processed: number;
  imagesRemoved: number;
}> {
  const supabase = getClient();
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data: products, error } = await supabase
    .from("products")
    .select("id, images:product_images(id, url)")
    .eq("status", "sold")
    .lt("sold_at", cutoff);

  if (error) throw error;

  let imagesRemoved = 0;

  for (const product of products ?? []) {
    const images = (product as { images?: { id: string; url: string }[] }).images ?? [];

    for (const image of images) {
      await deleteR2Object(image.url);
      await supabase.from("product_images").delete().eq("id", image.id);
      imagesRemoved += 1;
    }

    await supabase
      .from("products")
      .update({ status: "archived" })
      .eq("id", product.id);
  }

  return { processed: products?.length ?? 0, imagesRemoved };
}

export async function exportProductMetadata(): Promise<{
  filename: string;
  count: number;
}> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_EXPORT_SELECT)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const now = new Date();
  const filename = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}.json`;
  const dir = path.join(process.cwd(), "archive");
  await mkdir(dir, { recursive: true });

  const payload = {
    exported_at: now.toISOString(),
    product_count: data?.length ?? 0,
    products: data ?? [],
  };

  await writeFile(path.join(dir, filename), JSON.stringify(payload, null, 2), "utf-8");

  return { filename, count: data?.length ?? 0 };
}

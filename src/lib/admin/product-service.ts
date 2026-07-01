import { getActiveDropId } from "@/lib/admin/drop-service";
import { createServiceClient } from "@/lib/supabase/service";
import { buildSearchTokens } from "@/lib/products/build-search-tokens";
import { generateSku } from "@/lib/products/generate-sku";
import { slugify } from "@/lib/products/slugify";
import type { ProductInput, ProductUpdateInput } from "@/types/admin";
import type { ProductStatus, ProductWithRelations } from "@/types/product";

const PRODUCT_SELECT = `
  *,
  category:categories(*),
  images:product_images(*)
`;

function getClient() {
  const client = createServiceClient();
  if (!client) throw new Error("Database not configured");
  return client;
}

export async function listAdminProducts(search?: string, status?: ProductStatus) {
  const supabase = getClient();
  let query = supabase.from("products").select(PRODUCT_SELECT).order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);
  if (search?.trim()) {
    const q = search.trim().replace(/[%_,]/g, "");
    query = query.or(
      `name.ilike.%${q}%,sku.ilike.%${q}%,search_tokens.ilike.%${q}%`,
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as ProductWithRelations[];
}

export async function getAdminProduct(id: string) {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as ProductWithRelations;
}

export async function createProduct(input: ProductInput) {
  const supabase = getClient();
  const isNewDrop = input.is_new_drop ?? false;

  const [sku, dropId] = await Promise.all([
    generateSku(),
    isNewDrop ? getActiveDropId().catch(() => null) : Promise.resolve(null),
  ]);

  const slug = slugify(input.name, input.size);
  const search_tokens = buildSearchTokens(input.name, input.size ?? null, input.price, sku);

  const { data, error } = await supabase
    .from("products")
    .insert({
      ...input,
      slug,
      sku,
      search_tokens,
      status: input.status ?? "available",
      is_new_drop: isNewDrop,
      drop_id: dropId,
    })
    .select(PRODUCT_SELECT)
    .single();

  if (error) throw error;
  return data as ProductWithRelations;
}

export async function updateProduct(id: string, input: ProductUpdateInput) {
  const supabase = getClient();
  const existing = await getAdminProduct(id);

  const name = input.name ?? existing.name;
  const size = input.size !== undefined ? input.size : existing.size;
  const price = input.price ?? existing.price;
  const slug = input.name || input.size !== undefined ? slugify(name, size) : existing.slug;
  const search_tokens = buildSearchTokens(name, size, price, existing.sku);

  const patch: Record<string, unknown> = { ...input, slug, search_tokens };

  if (input.is_new_drop === true) {
    patch.drop_id = await getActiveDropId().catch(() => null);
  }

  if (input.is_new_drop === false) {
    patch.drop_id = null;
  }

  if (input.status === "sold" && existing.status !== "sold") {
    patch.sold_at = new Date().toISOString();
    patch.is_new_drop = false;
  }

  if (input.status === "available") {
    patch.sold_at = null;
  }

  const { data, error } = await supabase
    .from("products")
    .update(patch)
    .eq("id", id)
    .select(PRODUCT_SELECT)
    .single();

  if (error) throw error;
  return data as ProductWithRelations;
}

export async function deleteProduct(id: string) {
  const supabase = getClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function markProductsSold(ids: string[]) {
  const supabase = getClient();
  const soldAt = new Date().toISOString();

  const { data, error } = await supabase
    .from("products")
    .update({ status: "sold", sold_at: soldAt, is_new_drop: false })
    .in("id", ids)
    .select(PRODUCT_SELECT);

  if (error) throw error;
  return (data ?? []) as ProductWithRelations[];
}

export async function addProductImage(
  productId: string,
  url: string,
  alt?: string | null,
) {
  const supabase = getClient();
  const { count } = await supabase
    .from("product_images")
    .select("*", { count: "exact", head: true })
    .eq("product_id", productId);

  const { data, error } = await supabase
    .from("product_images")
    .insert({
      product_id: productId,
      url,
      alt: alt?.trim() || null,
      sort_order: count ?? 0,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProductImageAlt(imageId: string, alt: string | null) {
  const supabase = getClient();
  const { data, error } = await supabase
    .from("product_images")
    .update({ alt: alt?.trim() || null })
    .eq("id", imageId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeProductImage(imageId: string, url: string) {
  const supabase = getClient();
  const { error } = await supabase.from("product_images").delete().eq("id", imageId);
  if (error) throw error;
  return url;
}

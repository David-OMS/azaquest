import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "@/lib/mock-data";
import { filterProducts, type ProductQueryParams } from "@/lib/products/filter-products";
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Category, ProductWithRelations } from "@/types/product";

const PRODUCT_SELECT = `
  *,
  category:categories(*),
  images:product_images(*)
`;

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return MOCK_CATEGORIES;

  const supabase = createServerClient();
  if (!supabase) return MOCK_CATEGORIES;

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  if (error || !data) return [];
  return data as Category[];
}

export async function getProducts(
  params: ProductQueryParams,
): Promise<ProductWithRelations[]> {
  if (!isSupabaseConfigured()) {
    return filterProducts(MOCK_PRODUCTS, params);
  }

  const supabase = createServerClient();
  if (!supabase) return [];

  let query = supabase.from("products").select(PRODUCT_SELECT);

  if (params.status) {
    const statuses = Array.isArray(params.status) ? params.status : [params.status];
    query = query.in("status", statuses);
  }

  if (params.isNewDrop) {
    query = query.eq("is_new_drop", true);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  const products = data as ProductWithRelations[];
  return filterProducts(products, params);
}

export async function getProductBySlug(
  slug: string,
): Promise<ProductWithRelations | null> {
  if (!isSupabaseConfigured()) {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }

  const supabase = createServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .single();

  if (error || !data) return null;

  return data as ProductWithRelations;
}

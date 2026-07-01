export type ProductStatus = "draft" | "available" | "sold" | "archived";

export interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  sort_order: number;
  alt: string | null;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category_id: string;
  size: string | null;
  price: number;
  price_max: number | null;
  status: ProductStatus;
  is_new_drop: boolean;
  drop_id: string | null;
  sku: string;
  ig_post_url: string | null;
  sold_at: string | null;
  created_at: string;
  updated_at: string;
  category?: Category;
  images?: ProductImage[];
}

export interface ProductWithRelations extends Product {
  category: Category;
  images: ProductImage[];
}

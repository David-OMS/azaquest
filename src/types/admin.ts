import type { ProductStatus } from "@/types/product";

export interface ProductInput {
  name: string;
  description?: string | null;
  category_id: string;
  size?: string | null;
  price: number;
  price_max?: number | null;
  status?: ProductStatus;
  is_new_drop?: boolean;
  ig_post_url?: string | null;
  ig_caption_snippet?: string | null;
}

export interface ProductUpdateInput extends Partial<ProductInput> {
  status?: ProductStatus;
}

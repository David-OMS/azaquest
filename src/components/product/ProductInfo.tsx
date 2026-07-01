import { formatPriceRange } from "@/lib/format-price";
import type { ProductWithRelations } from "@/types/product";

interface ProductInfoProps {
  product: ProductWithRelations;
  sold?: boolean;
}

export function ProductInfo({ product, sold = false }: ProductInfoProps) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs tracking-[0.2em] text-muted">{product.category.name}</p>
        <h1 className="mt-2 text-2xl font-medium text-foreground md:text-3xl">{product.name}</h1>
      </div>

      <p className="text-lg text-foreground">{formatPriceRange(product.price, product.price_max)}</p>

      {product.size && (
        <p className="text-sm text-muted">Size: <span className="text-foreground">{product.size}</span></p>
      )}

      <p className="text-xs text-muted">SKU: {product.sku}</p>

      {product.price_max && product.price_max > product.price && (
        <p className="text-sm text-muted">Price varies by set — DM for details.</p>
      )}

      {product.description && (
        <p className="text-sm leading-relaxed text-muted">{product.description}</p>
      )}

      {sold && (
        <p className="border border-border px-4 py-3 text-sm tracking-wide text-muted">
          This quest has been claimed.
        </p>
      )}
    </div>
  );
}

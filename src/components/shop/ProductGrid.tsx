import type { ProductWithRelations } from "@/types/product";
import { ProductCard } from "@/components/shop/ProductCard";

interface ProductGridProps {
  products: ProductWithRelations[];
  sold?: boolean;
}

export function ProductGrid({ products, sold = false }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3 xl:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} sold={sold} />
      ))}
    </div>
  );
}

import { notFound } from "next/navigation";
import { AdminEditProductClient } from "@/components/admin/AdminEditProductClient";
import { getAdminProduct } from "@/lib/admin/product-service";
import { getCategories } from "@/lib/products/get-products";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;

  let product;
  try {
    product = await getAdminProduct(id);
  } catch {
    notFound();
  }

  const categories = await getCategories();

  return (
    <div>
      <h1 className="mb-6 text-xl font-medium">Edit product</h1>
      <AdminEditProductClient product={product} categories={categories} />
    </div>
  );
}

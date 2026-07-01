import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product/ProductDetail";
import { getProductBySlug } from "@/lib/products/get-products";
import { getSiteSettings } from "@/lib/site/get-settings";
import { resolveWhatsAppNumber } from "@/lib/whatsapp";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Not found | AZAQUEST" };

  const image = product.images?.[0]?.url;
  return {
    title: `${product.name} | AZAQUEST`,
    description: `${product.name}${product.size ? ` — Size ${product.size}` : ""}. ${product.price ? `₦${product.price.toLocaleString()}` : ""}`,
    openGraph: image
      ? { title: product.name, images: [{ url: image }] }
      : { title: product.name },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getSiteSettings(),
  ]);

  if (!product) notFound();

  return (
    <ProductDetail
      product={product}
      whatsappNumber={resolveWhatsAppNumber(settings.whatsapp_number)}
    />
  );
}

import { revalidatePath } from "next/cache";

/** Bust storefront caches after admin catalog changes. */
export function revalidateStorefront(slug?: string) {
  revalidatePath("/");
  revalidatePath("/new-drops");
  revalidatePath("/shop");
  revalidatePath("/sold");
  if (slug) revalidatePath(`/shop/${slug}`);
}

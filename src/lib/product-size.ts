import type { Category } from "@/types/product";

const WAIST_LENGTH_CATEGORY_SLUGS = new Set(["pants", "jeans"]);

export function isWaistLengthCategory(slug: string | undefined): boolean {
  return slug ? WAIST_LENGTH_CATEGORY_SLUGS.has(slug) : false;
}

export function formatWaistLengthSize(waist: string, length: string): string {
  return `W${waist.trim()} L${length.trim()}`;
}

export function parseWaistLengthSize(size: string | null | undefined): {
  waist: string;
  length: string;
} {
  if (!size) return { waist: "", length: "" };

  const labeled = size.match(/W\s*(\d+(?:\.\d+)?)\s*L\s*(\d+(?:\.\d+)?)/i);
  if (labeled) return { waist: labeled[1], length: labeled[2] };

  const byX = size.match(/^(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)$/i);
  if (byX) return { waist: byX[1], length: byX[2] };

  if (/^\d+(?:\.\d+)?$/.test(size.trim())) {
    return { waist: size.trim(), length: "" };
  }

  return { waist: "", length: "" };
}

export function resolveProductSize(
  categories: Category[],
  categoryId: string,
  size: string,
  waist: string,
  length: string,
): { value: string | null; error?: string } {
  const category = categories.find((c) => c.id === categoryId);

  if (isWaistLengthCategory(category?.slug)) {
    const w = waist.trim();
    const l = length.trim();
    if (!w || !l) {
      return { value: null, error: "Enter waist and length." };
    }
    return { value: formatWaistLengthSize(w, l) };
  }

  return { value: size.trim() || null };
}

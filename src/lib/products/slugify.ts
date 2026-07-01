export function slugify(name: string, size?: string | null): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  if (size) {
    const sizeSlug = size
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    if (sizeSlug) return `${base}-${sizeSlug}`;
  }

  return base;
}

export function buildProductSlug(
  name: string,
  size: string | null | undefined,
  sku: string,
): string {
  const slug = slugify(name, size);
  if (slug) return slug;
  return sku.toLowerCase();
}

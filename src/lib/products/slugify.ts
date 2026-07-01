export function slugify(name: string, size?: string | null): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  if (size) {
    const sizeSlug = size.toLowerCase().replace(/\s+/g, "-");
    return `${base}-${sizeSlug}`;
  }

  return base;
}

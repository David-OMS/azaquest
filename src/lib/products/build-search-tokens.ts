export function buildSearchTokens(
  name: string,
  size: string | null,
  price: number,
  sku: string,
): string {
  return [name, size, String(price), sku]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

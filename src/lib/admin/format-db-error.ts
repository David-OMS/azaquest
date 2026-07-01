export function formatDbError(err: unknown, fallback: string): string {
  if (!err || typeof err !== "object" || !("message" in err)) return fallback;

  const message = String((err as { message: string }).message);

  if (message.includes("products_slug_key")) {
    return "A product with this name already exists. Change the name or add a size.";
  }
  if (message.includes("products_sku_key")) {
    return "Could not generate a unique SKU. Try again.";
  }
  if (message.includes("products_category_id_fkey")) {
    return "Invalid category. Refresh the page and try again.";
  }
  if (message.includes("invalid input syntax for type integer")) {
    return "Enter a valid price.";
  }

  return message || fallback;
}

export function formatPrice(price: number, priceMax?: number | null): string {
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(n);

  if (priceMax && priceMax > price) {
    return `From ${fmt(price)}`;
  }

  return fmt(price);
}

export function formatPriceRange(price: number, priceMax?: number | null): string {
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(n);

  if (priceMax && priceMax > price) {
    return `${fmt(price)} – ${fmt(priceMax)}`;
  }

  return fmt(price);
}

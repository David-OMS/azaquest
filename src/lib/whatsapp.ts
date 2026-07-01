import type { CartItem } from "@/types/cart";

interface WhatsAppItem {
  name: string;
  size: string | null;
  price: number;
  priceMax?: number | null;
}

function formatItemLine(item: WhatsAppItem): string {
  const sizePart = item.size ? ` (${item.size})` : "";
  const priceFmt = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(item.price);

  return `${item.name}${sizePart} — ${priceFmt}`;
}

export function buildWhatsAppUrl(
  phone: string,
  items: WhatsAppItem[],
  messagePrefix = "Hi AZAQUEST, I'm interested in:",
): string {
  const lines = items.map((item) => `• ${formatItemLine(item)}`);
  const message = `${messagePrefix}\n\n${lines.join("\n")}`;
  const digits = phone.replace(/\D/g, "");

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function cartToWhatsAppItems(items: CartItem[]): WhatsAppItem[] {
  return items.map((item) => ({
    name: item.name,
    size: item.size,
    price: item.price,
    priceMax: item.priceMax,
  }));
}

export function getWhatsAppNumber(): string {
  return process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348000000000";
}

export function resolveWhatsAppNumber(fromSettings?: string | null): string {
  return fromSettings?.replace(/\D/g, "") || getWhatsAppNumber();
}

export function resolveIgHandle(fromSettings?: string | null): string {
  return fromSettings?.replace(/^@/, "") || process.env.NEXT_PUBLIC_IG_HANDLE || "azaquest";
}

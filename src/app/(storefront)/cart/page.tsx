import { CartPage } from "@/components/cart/CartPage";
import { getSiteSettings } from "@/lib/site/get-settings";
import { resolveWhatsAppNumber } from "@/lib/whatsapp";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart | AZAQUEST",
};

export default async function Cart() {
  const settings = await getSiteSettings();
  return (
    <CartPage whatsappNumber={resolveWhatsAppNumber(settings.whatsapp_number)} />
  );
}

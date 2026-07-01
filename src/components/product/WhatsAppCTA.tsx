import { buildWhatsAppUrl } from "@/lib/whatsapp";

interface WhatsAppCTAProps {
  name: string;
  size: string | null;
  price: number;
  priceMax?: number | null;
  phone: string;
  label?: string;
  className?: string;
}

export function WhatsAppCTA({
  name,
  size,
  price,
  priceMax,
  phone,
  label = "Continue quest on WhatsApp",
  className = "",
}: WhatsAppCTAProps) {
  const url = buildWhatsAppUrl(phone, [
    { name, size, price, priceMax },
  ]);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-block w-full border border-foreground bg-foreground px-6 py-3 text-center text-sm font-medium tracking-wider text-background transition-colors hover:bg-transparent hover:text-foreground ${className}`}
    >
      {label}
    </a>
  );
}

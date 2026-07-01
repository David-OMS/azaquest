"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { useFavourites } from "@/hooks/use-favourites";
import { useCart } from "@/hooks/use-cart";

function IconLink({
  href,
  label,
  count,
  children,
}: {
  href: string;
  label: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="relative p-2 text-foreground transition-opacity hover:opacity-70"
    >
      {children}
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-medium text-background">
          {count}
        </span>
      )}
    </Link>
  );
}

export function HeaderActions() {
  const { count: favCount, hydrated: favReady } = useFavourites();
  const { count: cartCount, hydrated: cartReady } = useCart();

  return (
    <nav className="flex items-center gap-1">
      <ThemeToggle />
      <IconLink href="/favourites" label="Favourites" count={favReady ? favCount : 0}>
        <HeartIcon />
      </IconLink>
      <IconLink href="/cart" label="Cart" count={cartReady ? cartCount : 0}>
        <BagIcon />
      </IconLink>
    </nav>
  );
}

function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

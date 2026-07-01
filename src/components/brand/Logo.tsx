"use client";

import Image from "next/image";
import Link from "next/link";
import { brandAssets, type LogoVariant } from "@/lib/brand";
import { useTheme } from "@/components/layout/ThemeProvider";

const SIZES = {
  icon: { width: 40, height: 40, className: "h-9 w-9" },
  lockup: { width: 300, height: 48, className: "h-9 w-auto" },
} as const;

interface LogoProps {
  variant?: LogoVariant;
  /** Pass `null` for a non-linked logo. Defaults to `/`. */
  href?: string | null;
  className?: string;
  priority?: boolean;
}

export function Logo({
  variant = "icon",
  href = "/",
  className = "",
  priority = false,
}: LogoProps) {
  const { theme } = useTheme();
  const src = brandAssets[variant][theme];
  const { width, height, className: sizeClass } = SIZES[variant];
  const alt = variant === "icon" ? "AZAQUEST" : "AZAQUEST wordmark";

  const image = (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={`${sizeClass} object-contain ${className}`}
    />
  );

  if (href === null) return image;

  return (
    <Link
      href={href}
      className="inline-flex shrink-0 transition-opacity hover:opacity-70"
      aria-label="AZAQUEST home"
    >
      {image}
    </Link>
  );
}

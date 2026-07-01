"use client";

import Image from "next/image";
import Link from "next/link";
import { brandAssets } from "@/lib/brand";
import { useTheme } from "@/components/layout/ThemeProvider";

const LOCKUP_SIZES = {
  header: { width: 300, height: 48, className: "h-9 w-auto sm:h-10" },
  footer: { width: 340, height: 56, className: "h-10 w-auto sm:h-12" },
} as const;

type LockupSize = keyof typeof LOCKUP_SIZES;

interface LogoLockupProps {
  size?: LockupSize;
  /** Pass `null` for a non-linked lockup. Defaults to `/`. */
  href?: string | null;
  className?: string;
  priority?: boolean;
}

export function LogoLockup({
  size = "header",
  href = "/",
  className = "",
  priority = false,
}: LogoLockupProps) {
  const { theme } = useTheme();
  const { width, height, className: sizeClass } = LOCKUP_SIZES[size];
  const src = brandAssets.lockup[theme];

  const image = (
    <Image
      src={src}
      alt="AZAQUEST"
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

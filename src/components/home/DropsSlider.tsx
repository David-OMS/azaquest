"use client";

import Image from "next/image";
import Link from "next/link";
import type { ProductWithRelations } from "@/types/product";

interface DropsSliderProps {
  products: ProductWithRelations[];
}

/** Repeat products until the track is wide enough to fill wide screens twice. */
function expandForMarquee(products: ProductWithRelations[], minCount = 24) {
  if (!products.length) return [];
  const out: ProductWithRelations[] = [];
  while (out.length < minCount) out.push(...products);
  return out;
}

function Slide({ product }: { product: ProductWithRelations }) {
  const image = product.images?.[0]?.url;

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group relative block h-64 w-48 shrink-0 overflow-hidden bg-surface"
    >
      {image ? (
        <Image
          src={image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="192px"
        />
      ) : (
        <div className="flex h-full items-center justify-center px-2 text-center text-xs text-muted">
          {product.name}
        </div>
      )}
    </Link>
  );
}

export function DropsSlider({ products }: DropsSliderProps) {
  if (!products.length) return null;

  const base = expandForMarquee(products);
  const track = [...base, ...base];

  return (
    <section className="border-t border-border bg-background py-10">
      <div className="mb-6 flex items-center justify-between px-4 sm:px-6">
        <h2 className="font-display text-sm font-semibold tracking-[0.35em] text-foreground">NEW DROPS</h2>
        <Link href="/new-drops" className="text-xs text-muted hover:text-foreground">
          View all
        </Link>
      </div>
      <div className="overflow-hidden pl-4 sm:pl-6">
        <div className="marquee-track flex w-max gap-4 will-change-transform">
          {track.map((product, i) => (
            <Slide key={`${product.id}-${i}`} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

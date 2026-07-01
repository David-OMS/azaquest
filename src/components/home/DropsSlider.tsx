"use client";

import Image from "next/image";
import Link from "next/link";
import type { ProductWithRelations } from "@/types/product";

interface DropsSliderProps {
  products: ProductWithRelations[];
}

export function DropsSlider({ products }: DropsSliderProps) {
  if (!products.length) return null;

  const slides = [...products, ...products];

  return (
    <section className="border-t border-border py-10">
      <div className="mb-6 flex items-center justify-between px-4 sm:px-6">
        <h2 className="font-display text-sm font-semibold tracking-[0.35em] text-foreground">NEW DROPS</h2>
        <Link href="/new-drops" className="text-xs text-muted hover:text-foreground">
          View all
        </Link>
      </div>
      <div className="overflow-hidden">
        <div className="marquee-track flex w-max gap-4 px-4">
          {slides.map((product, i) => {
            const image = product.images?.[0]?.url;
            return (
              <Link
                key={`${product.id}-${i}`}
                href={`/shop/${product.slug}`}
                className="group relative h-64 w-48 shrink-0 overflow-hidden bg-surface"
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
                  <div className="flex h-full items-center justify-center text-xs text-muted">
                    {product.name}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

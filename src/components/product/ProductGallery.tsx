"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/types/product";

interface ProductGalleryProps {
  images: ProductImage[];
  name: string;
  dimmed?: boolean;
}

export function ProductGallery({ images, name, dimmed = false }: ProductGalleryProps) {
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
  const [active, setActive] = useState(0);
  const current = sorted[active];

  if (!sorted.length) {
    return (
      <div className="aspect-[3/4] bg-surface flex items-center justify-center text-muted">
        No image
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={`relative aspect-[3/4] overflow-hidden bg-surface ${dimmed ? "opacity-60" : ""}`}>
        {current && (
          <Image
            src={current.url}
            alt={current.alt ?? name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        )}
      </div>
      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-20 w-16 shrink-0 overflow-hidden border ${
                i === active ? "border-foreground" : "border-border"
              }`}
            >
              <Image
                src={img.url}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

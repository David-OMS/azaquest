"use client";

import { useEffect, useRef } from "react";
import type { StagedImage } from "@/types/admin-images";

interface AdminStagedImagesProps {
  images: StagedImage[];
  onChange: (images: StagedImage[]) => void;
}

export function AdminStagedImages({ images, onChange }: AdminStagedImagesProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef(images);
  imagesRef.current = images;

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    };
  }, []);

  const addFiles = (files: FileList | null) => {
    if (!files?.length) return;

    const next = [
      ...images,
      ...Array.from(files).map((file) => ({
        id: crypto.randomUUID(),
        file,
        previewUrl: URL.createObjectURL(file),
        label: "",
      })),
    ];
    onChange(next);
  };

  const updateLabel = (id: string, label: string) => {
    onChange(images.map((img) => (img.id === id ? { ...img, label } : img)));
  };

  const removeImage = (id: string) => {
    const target = images.find((img) => img.id === id);
    if (target) URL.revokeObjectURL(target.previewUrl);
    onChange(images.filter((img) => img.id !== id));
  };

  return (
    <section className="border border-border p-4 sm:p-6">
      <h2 className="text-sm font-medium tracking-[0.15em]">PRODUCT PHOTOS</h2>
      <p className="mt-2 text-sm text-muted">
        Add images first. First image is the shop thumbnail. Label each photo (e.g. front, back, tag).
      </p>

      {images.length > 0 && (
        <div className="mt-4 space-y-4">
          {images.map((img, index) => (
            <div key={img.id} className="flex gap-3 border border-border p-3">
              <div key={img.id} className="relative aspect-[3/4] overflow-hidden bg-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.previewUrl}
                  alt={img.label || `Preview ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                {index === 0 && (
                  <span className="absolute bottom-0 left-0 bg-black/80 px-1 text-[10px] text-white">
                    Cover
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <label className="block text-xs text-muted">
                  Label
                  <input
                    value={img.label}
                    onChange={(e) => updateLabel(img.id, e.target.value)}
                    placeholder="Front, back, detail..."
                    className="mt-1 w-full border border-border bg-surface px-2 py-1.5 text-sm outline-none focus:border-white"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="text-xs text-muted hover:text-white"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="border border-white px-4 py-2 text-xs tracking-wider hover:bg-white hover:text-black"
        >
          {images.length ? "Add more images" : "Add images"}
        </button>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductWithRelations } from "@/types";

type ProductImages = ProductWithRelations["images"];

interface ProductImageGalleryProps {
  images: ProductImages;
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const hasMultipleImages = images.length > 1;
  const selectedImage = images[selectedIndex];
  const fallbackImage = "/placeholders/bangle-placeholder.svg";

  function showPreviousImage() {
    setSelectedIndex((currentIndex) => Math.max(0, currentIndex - 1));
  }

  function showNextImage() {
    setSelectedIndex((currentIndex) => Math.min(images.length - 1, currentIndex + 1));
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-blush-50">
        <Image
          src={selectedImage?.url ?? fallbackImage}
          alt={selectedImage?.altText ?? productName}
          fill
          className="object-cover"
          priority
        />
        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={showPreviousImage}
              disabled={selectedIndex === 0}
              aria-label="Show previous product image"
              className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-cream-50/90 text-2xl text-blush-800 shadow-sm transition hover:bg-cream-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span aria-hidden="true">‹</span>
            </button>
            <button
              type="button"
              onClick={showNextImage}
              disabled={selectedIndex === images.length - 1}
              aria-label="Show next product image"
              className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-cream-50/90 text-2xl text-blush-800 shadow-sm transition hover:bg-cream-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span aria-hidden="true">›</span>
            </button>
          </>
        )}
      </div>

      {hasMultipleImages && (
        <div className="flex gap-3 overflow-x-auto pb-1" aria-label="Product image thumbnails">
          {images.map((image, index) => {
            const isSelected = index === selectedIndex;

            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={`Show product image ${index + 1}`}
                aria-current={isSelected ? "true" : undefined}
                className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-blush-50 transition sm:w-24 ${
                  isSelected ? "border-blush-600" : "border-transparent hover:border-blush-300"
                }`}
              >
                <Image src={image.url} alt={image.altText ?? productName} fill className="object-cover" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

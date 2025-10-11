"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageGalleryProps {
  images: { url: string; alt?: string }[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="h-80 lg:h-96 flex items-center justify-center">
        <span className="text-[var(--color-thistle)] text-lg">No image</span>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="h-80 lg:h-96 flex items-center justify-center">
        <Image 
          src={images[0].url} 
          alt={images[0].alt ?? title} 
          width={800}
          height={600}
          className="max-w-full max-h-full object-contain" 
        />
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div>
      {/* Image Counter - Above image */}
      {images.length > 1 && (
				<div className="text-right text-responsive text-sm mb-2">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Main Image Container */}
      <div className="h-80 lg:h-96 relative">
        <div className="h-full flex items-center justify-center">
          <Image 
            src={images[currentIndex].url} 
            alt={images[currentIndex].alt ?? title} 
            width={800}
            height={600}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Navigation Arrows - Inside image area but on edges */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
									className="absolute left-2 top-1/2 transform -translate-y-1/2 text-responsive hover:text-[var(--accent)] p-2 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            
            <button
              onClick={goToNext}
									className="absolute right-2 top-1/2 transform -translate-y-1/2 text-responsive hover:text-[var(--accent)] p-2 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails - Below image */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-4 pb-2">
          {images.map((image, index) => {
            const isActive = index === currentIndex;
            const buttonClass = isActive 
              ? "w-12 h-12 border-2 border-[var(--accent)] transition-all"
              : "w-12 h-12 border-2 border-[var(--border)] hover:border-[var(--accent)] transition-all";
            
            return (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={buttonClass}
              aria-label={`Go to image ${index + 1}`}
            >
              <Image 
                src={image.url} 
                alt={image.alt ?? `${title} thumbnail ${index + 1}`}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

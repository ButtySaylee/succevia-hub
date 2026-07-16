"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface ServiceRequestLightboxProps {
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}

export default function ServiceRequestLightbox({
  images,
  initialIndex = 0,
  onClose,
}: ServiceRequestLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (images.length === 0) return null;

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all"
        aria-label="Close image viewer"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute top-4 left-4 z-10 bg-black/50 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Previous button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={images[currentIndex]}
        alt={`Image ${currentIndex + 1}`}
        className="max-w-full max-h-full object-contain p-4 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      )}
    </div>
  );
}
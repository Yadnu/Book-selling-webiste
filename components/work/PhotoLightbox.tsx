'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Photo {
  id: string;
  title?: string | null;
  caption?: string | null;
  url: string;
  category: string;
}

interface PhotoLightboxProps {
  photos: Photo[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function PhotoLightbox({
  photos,
  currentIndex,
  onClose,
  onNavigate,
}: PhotoLightboxProps) {
  const currentPhoto = photos[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate((currentIndex - 1 + photos.length) % photos.length);
      if (e.key === 'ArrowRight') onNavigate((currentIndex + 1) % photos.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, photos.length, onClose, onNavigate]);

  if (!currentPhoto) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-abyssal-900/95 backdrop-blur-md flex items-center justify-center p-4"
      role="dialog"
      aria-label="Image Lightbox"
      aria-modal="true"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-2 text-fog hover:text-brass focus-visible:outline-none z-50 bg-storm/80 rounded-full border border-seafoam/20"
        aria-label="Close Lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev Navigation */}
      <button
        onClick={() => onNavigate((currentIndex - 1 + photos.length) % photos.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-fog hover:text-brass focus-visible:outline-none z-50 bg-storm/80 rounded-full border border-seafoam/20"
        aria-label="Previous Image"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Next Navigation */}
      <button
        onClick={() => onNavigate((currentIndex + 1) % photos.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-fog hover:text-brass focus-visible:outline-none z-50 bg-storm/80 rounded-full border border-seafoam/20"
        aria-label="Next Image"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Image & Caption Container */}
      <div className="max-w-4xl w-full flex flex-col items-center space-y-4">
        <div className="relative w-full h-[65vh] sm:h-[75vh] rounded border border-seafoam/20 overflow-hidden shadow-2xl bg-abyssal">
          <Image
            src={currentPhoto.url}
            alt={currentPhoto.title || 'Arthur Milton photography archive'}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Details Footer */}
        <div className="text-center space-y-1 max-w-xl">
          {currentPhoto.title && (
            <h4 className="font-display text-xl text-fog font-medium">{currentPhoto.title}</h4>
          )}
          {currentPhoto.caption && (
            <p className="font-body text-sm text-seafoam italic">{currentPhoto.caption}</p>
          )}
          <span className="inline-block font-mono text-[10px] text-brass uppercase tracking-widest pt-1">
            Photo {currentIndex + 1} of {photos.length} • {currentPhoto.category}
          </span>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  ArrowsPointingOutIcon,
  PhotoIcon,
} from "@heroicons/react/24/solid";
import { clsx } from "clsx";

interface BookingGalleryProps {
  images: string[];
  name: string;
  type: "activity" | "destination";
  activityType?: string;
  rating: number;
  reviewCount: number;
}

export function BookingGallery({
  images,
  name,
  type,
  activityType,
  rating,
  reviewCount,
}: BookingGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const hasImages = images && images.length > 0;
  const safeImages = hasImages ? images : ["/placeholder-image.jpg"];

  const openFullscreen = () => setIsFullscreen(true);
  const closeFullscreen = () => {
    setIsFullscreen(false);
    setIsLoading(true);
  };

  const showPrev = useCallback(() => {
    setSelectedImage((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
    setIsLoading(true);
  }, [safeImages.length]);

  const showNext = useCallback(() => {
    setSelectedImage((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
    setIsLoading(true);
  }, [safeImages.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "Escape") closeFullscreen();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, showPrev, showNext]);

  // Lock body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  const displayedImage = hoveredImage !== null ? hoveredImage : selectedImage;

  return (
    <>
      {/* Main Gallery Card */}
      <section className="relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Main Image Container */}
        <div className="relative w-full aspect-[16/10] rounded-t-2xl overflow-hidden group">
          {/* Click overlay to open fullscreen */}
          <button
            type="button"
            onClick={openFullscreen}
            className="absolute inset-0 z-10 focus:outline-none cursor-zoom-in"
            aria-label="View fullscreen gallery"
          />

          {/* Image with smooth loading */}
          <div className={clsx(
            "relative w-full h-full transition-opacity duration-500",
            isLoading ? "opacity-0" : "opacity-100"
          )}>
            <Image
              src={safeImages[displayedImage]}
              alt={`${name} - Image ${displayedImage + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 66vw"
              priority={displayedImage === 0}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setImageError(true);
                setIsLoading(false);
              }}
            />
            {/* Image error fallback */}
            {imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="text-center text-gray-400">
                  <PhotoIcon className="w-16 h-16 mx-auto mb-2" />
                  <p className="text-sm">Image unavailable</p>
                </div>
              </div>
            )}
          </div>

          {/* Loading skeleton */}
          {isLoading && !imageError && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}

          {/* Gradient overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges overlay */}
          <div className="absolute top-4 left-4 z-20 flex gap-2 flex-wrap">
            {type === "activity" && activityType && (
              <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-md backdrop-blur-sm">
                {activityType.charAt(0).toUpperCase() + activityType.slice(1)}
              </span>
            )}
            <span className="bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md">
              <StarIcon className="w-4 h-4 text-amber-500 drop-shadow-sm" />
              <span>{rating.toFixed(1)}</span>
              <span className="text-gray-500 font-medium">({reviewCount})</span>
            </span>
          </div>

          {/* Fullscreen button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openFullscreen();
            }}
            className="absolute bottom-4 right-4 z-20 p-2.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-md text-gray-700 hover:bg-white hover:scale-105 transition-all duration-200"
            aria-label="Open fullscreen"
          >
            <ArrowsPointingOutIcon className="w-5 h-5" />
          </button>

          {/* Navigation arrows on image hover */}
          {safeImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-gray-800 opacity-0 group-hover:opacity-100 hover:bg-white hover:scale-110 transition-all duration-200"
                aria-label="Previous image"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-gray-800 opacity-0 group-hover:opacity-100 hover:bg-white hover:scale-110 transition-all duration-200"
                aria-label="Next image"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Image counter */}
          <div className="absolute bottom-4 left-4 z-20 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs font-medium">
            <span>{displayedImage + 1}</span>
            <span className="mx-1">/</span>
            <span>{safeImages.length}</span>
          </div>
        </div>

        {/* Thumbnail strip */}
        {safeImages.length > 1 && (
          <div className="p-3 bg-gray-50 border-t border-gray-100">
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {safeImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onMouseEnter={() => setHoveredImage(idx)}
                  onMouseLeave={() => setHoveredImage(null)}
                  onClick={() => {
                    setSelectedImage(idx);
                    setIsLoading(true);
                  }}
                  className={clsx(
                    "relative shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-300",
                    selectedImage === idx
                      ? "border-[#FF5F15] ring-2 ring-[#FF5F15]/20 scale-105"
                      : "border-transparent opacity-70 hover:opacity-100 hover:scale-105"
                  )}
                  aria-label={`View image ${idx + 1}`}
                  aria-current={selectedImage === idx ? "true" : "false"}
                >
                  <div className="w-24 h-16 sm:w-28 sm:h-20">
                    <Image
                      src={img}
                      alt={`${name} thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="120px"
                    />
                  </div>
                  {/* Active indicator */}
                  {selectedImage === idx && (
                    <div className="absolute inset-0 bg-[#FF5F15]/10" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md"
          onClick={closeFullscreen}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery fullscreen"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              closeFullscreen();
            }}
            className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 hover:scale-110 transition-all duration-200"
            aria-label="Close fullscreen"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          {/* Fullscreen image container */}
          <div
            className="relative w-[95vw] max-w-7xl aspect-[16/10] bg-black rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className={clsx(
              "relative w-full h-full transition-opacity duration-300",
              isLoading ? "opacity-0" : "opacity-100"
            )}>
              <Image
                src={safeImages[selectedImage]}
                alt={`${name} - Fullscreen image ${selectedImage + 1}`}
                fill
                className="object-contain"
                sizes="95vw"
                priority
                onLoad={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
              />
            </div>

            {/* Loading skeleton for fullscreen */}
            {isLoading && (
              <div className="absolute inset-0 bg-gray-800 animate-pulse" />
            )}

            {/* Navigation arrows */}
            {safeImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    showPrev();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 hover:scale-110 transition-all duration-200"
                  aria-label="Previous image"
                >
                  <ChevronLeftIcon className="w-8 h-8" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    showNext();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 hover:scale-110 transition-all duration-200"
                  aria-label="Next image"
                >
                  <ChevronRightIcon className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Image info bar */}
            <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold text-lg">{name}</p>
                  <p className="text-white/70 text-sm">
                    {selectedImage + 1} of {safeImages.length}
                  </p>
                </div>
                {/* Thumbnail strip in fullscreen */}
                {safeImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {safeImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImage(idx);
                          setIsLoading(true);
                        }}
                        className={clsx(
                          "relative shrink-0 w-16 h-12 rounded-md overflow-hidden border-2 transition-all",
                          selectedImage === idx
                            ? "border-white scale-110"
                            : "border-transparent opacity-60 hover:opacity-100"
                        )}
                      >
                        <Image
                          src={img}
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
            </div>

            {/* Keyboard hints */}
            <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-lg text-white/60 text-xs font-medium">
              Use ← → arrow keys to navigate
            </div>
          </div>
        </div>
      )}
    </>
  );
}

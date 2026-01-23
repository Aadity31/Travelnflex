"use client";

import { useState } from "react";
import Image from "next/image";
import {
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

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

  const hasImages = images && images.length > 0;
  const safeImages = hasImages ? images : ["/placeholder-image.jpg"];

  const openFullscreen = () => setIsFullscreen(true);
  const closeFullscreen = () => setIsFullscreen(false);

  const showPrev = () => {
    setSelectedImage((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
  };

  const showNext = () => {
    setSelectedImage((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
  };

  // Show hovered image if hovering, otherwise show selected image
  const displayedImage = hoveredImage !== null ? hoveredImage : selectedImage;

  return (
    <>
      {/* Main + thumbnails (TripPlanner-style) */}
      <section className="bg-white rounded-xl shadow-sm border border-[#e7eef3] p-2 overflow-hidden">
        {/* Main image */}
        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-2">
          {/* Click area to open full image */}
          <button
            type="button"
            onClick={openFullscreen}
            className="absolute inset-0 z-10 focus:outline-none"
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            {type === "activity" && activityType && (
              <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">
                {activityType.charAt(0).toUpperCase() + activityType.slice(1)}
              </span>
            )}
            <span className="bg-white text-gray-800 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
              <StarIcon className="w-4 h-4 text-amber-500" />
              {rating.toFixed(1)} ({reviewCount})
            </span>
          </div>

          {/* Main image */}
          <Image
            src={safeImages[displayedImage]}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 66vw"
          />
        </div>

        {/* Thumbnails: hover to preview, click to select */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onMouseEnter={() => setHoveredImage(idx)}
              onMouseLeave={() => setHoveredImage(null)}
              onClick={() => setSelectedImage(idx)}
              className={`w-24 h-16 shrink-0 rounded-md overflow-hidden border-2 transition-all ${
                selectedImage === idx
                  ? "border-[#FF5F15] opacity-100"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${name} ${idx + 1}`}
                width={96}
                height={64}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </section>

      {/* Fullscreen popout (click outside to close) */}
      {isFullscreen && (
        // Overlay: clicking here closes
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={closeFullscreen}
        >
          {/* Inner content: stop overlay click */}
          <div
            className="relative w-[96vw] max-w-6xl aspect-[16/9] bg-black rounded-xl overflow-hidden shadow-2xl flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                closeFullscreen();
              }}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            {/* Prev */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              className="absolute left-3 md:left-4 p-2 rounded-full bg-black/60 text-white hover:bg-black"
            >
              <ChevronLeftIcon className="w-7 h-7" />
            </button>

            {/* Image */}
            <Image
              src={safeImages[selectedImage]}
              alt={name}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 70vw"
            />

            {/* Next */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              className="absolute right-3 md:right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black"
            >
              <ChevronRightIcon className="w-7 h-7" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

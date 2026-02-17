"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import {
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  ArrowsPointingOutIcon,
  HomeIcon,
  CameraIcon,
} from "@heroicons/react/24/solid";
import { clsx } from "clsx";

interface BookingGalleryProps {
  images: string[];
  hotelImages?: string[];
  name: string;
  type: "activity" | "destination";
  activityType?: string;
  rating: number;
  reviewCount: number;
}

export function BookingGallery({
  images,
  hotelImages = [],
  name,
  type,
  activityType,
  rating,
  reviewCount,
}: BookingGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const thumbnailRef = useRef<HTMLDivElement>(null);

  // Combine main images and hotel images, marking hotel images
  const allImages = useCallback(() => {
    const mainImages = images.map((src, idx) => ({
      src,
      type: "main" as const,
      id: `main-${idx}`,
    }));
    const hotels = hotelImages.map((src, idx) => ({
      src,
      type: "hotel" as const,
      id: `hotel-${idx}`,
    }));
    return [...mainImages, ...hotels];
  }, [images, hotelImages])();

  const safeImages = allImages.length > 0 ? allImages : [{
    src: "/placeholder-image.jpg",
    type: "main" as const,
    id: "placeholder",
  }];

  const openFullscreen = () => {
    setIsFullscreen(true);
    setIsLoading(true);
    setImageError(false);
  };
  
  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  const showPrev = useCallback(() => {
    setSelectedIndex((prev) => (prev === 0 ? safeImages.length - 1 : prev - 1));
    setIsLoading(true);
    setImageLoaded(false);
  }, [safeImages.length]);

  const showNext = useCallback(() => {
    setSelectedIndex((prev) => (prev === safeImages.length - 1 ? 0 : prev + 1));
    setIsLoading(true);
    setImageLoaded(false);
  }, [safeImages.length]);

  // Keyboard and mouse wheel navigation
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "Escape") closeFullscreen();
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        showNext();
      } else if (e.deltaY < 0) {
        showPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", handleWheel);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", handleWheel);
    };
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

  // Scroll thumbnail into view when selected image changes
  useEffect(() => {
    if (thumbnailRef.current) {
      const thumbnails = thumbnailRef.current.querySelectorAll("[data-thumbnail]");
      const activeThumb = thumbnails[selectedIndex] as HTMLElement;
      if (activeThumb) {
        activeThumb.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [selectedIndex]);

  // Auto-hide navigation arrows in main view
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isHovering && !isFullscreen) {
      timeout = setTimeout(() => setIsHovering(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [isHovering, isFullscreen]);

  const currentImage = safeImages[selectedIndex];
  const isHotelImage = currentImage?.type === "hotel";
  const hasMultipleImages = safeImages.length > 1;

  return (
    <>
      {/* Main Gallery - Modern Card Design */}
      <section
        className="relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Main Image Container with Parallax-like Effect */}
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          {/* Click overlay to open fullscreen */}
          <button
            type="button"
            onClick={openFullscreen}
            className="absolute inset-0 z-10 focus:outline-none cursor-zoom-in"
            aria-label="View fullscreen gallery"
          />

          {/* Image with smooth transitions - only zoom on navigation */}
          <div
            className={clsx(
              "relative w-full h-full transition-all duration-700 ease-out",
              !imageLoaded ? "scale-105 opacity-0" : "scale-100 opacity-100"
            )}
          >
            <Image
              src={currentImage?.src || "/placeholder-image.jpg"}
              alt={`${name} - Image ${selectedIndex + 1}`}
              fill
              className={clsx(
                "object-cover transition-transform duration-1000",
                !imageLoaded ? "scale-110" : "scale-100"
              )}
              sizes="(max-width: 1024px) 100vw, 66vw"
              priority={selectedIndex === 0}
              onLoad={() => {
                setIsLoading(false);
                setImageLoaded(true);
              }}
              onError={() => {
                setImageError(true);
                setIsLoading(false);
                setImageLoaded(true);
              }}
            />
          </div>

          {/* Image error fallback */}
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <div className="text-center text-gray-400">
                <CameraIcon className="w-20 h-20 mx-auto mb-3 opacity-50" />
                <p className="text-lg font-medium">Image unavailable</p>
              </div>
            </div>
          )}

          {/* Loading skeleton - only show when actually loading */}
          {isLoading && !isFullscreen && !imageError && (
            <div className="absolute inset-0 bg-linear-to-r from-gray-200 via-gray-100 to-gray-200 animate-shimmer">
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-wave" />
            </div>
          )}

          {/* Dynamic overlay based on image type */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-500" />

          {/* Floating Badge - Hotel indicator */}
          {isHotelImage && hotelImages.length > 0 && (
            <div className="absolute top-4 left-4 z-20">
              <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">
                <HomeIcon className="w-4 h-4 text-[#FF5F15]" />
                Hotel View
              </span>
            </div>
          )}

          {/* Rating Badge */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <span className="bg-white/95 backdrop-blur-sm text-gray-800 text-sm font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg">
              <StarIcon className="w-5 h-5 text-amber-400 drop-shadow-sm" />
              <span>{rating.toFixed(1)}</span>
              <span className="text-gray-500 font-medium text-xs">({reviewCount})</span>
            </span>
          </div>

          {/* Activity Type Badge */}
          {type === "activity" && activityType && (
            <div className="absolute top-4 left-4 z-20">
              <span className="bg-linear-to-r from-[#FF5F15] to-[#ea580c] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-sm">
                {activityType.charAt(0).toUpperCase() + activityType.slice(1)}
              </span>
            </div>
          )}

          {/* Fullscreen button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openFullscreen();
            }}
            className="absolute bottom-4 right-4 z-20 p-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg text-gray-700 hover:bg-white hover:scale-110 transition-all duration-300"
            aria-label="Open fullscreen"
          >
            <ArrowsPointingOutIcon className="w-5 h-5" />
          </button>

          {/* Navigation arrows - Slide in on hover */}
          {hasMultipleImages && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrev();
                }}
                className={clsx(
                  "absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/95 backdrop-blur-sm rounded-full shadow-xl text-gray-800 hover:bg-white hover:scale-110 transition-all duration-300",
                  isHovering ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                )}
                aria-label="Previous image"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                className={clsx(
                  "absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/95 backdrop-blur-sm rounded-full shadow-xl text-gray-800 hover:bg-white hover:scale-110 transition-all duration-300",
                  isHovering ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                )}
                aria-label="Next image"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image counter */}
          <div className="absolute bottom-4 left-4 z-20 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm font-medium flex items-center gap-2">
            <span>{selectedIndex + 1}</span>
            <span className="opacity-50">/</span>
            <span>{safeImages.length}</span>
          </div>
        </div>

        {/* Enhanced Thumbnail strip with center snapping */}
        {hasMultipleImages && (
          <div className="p-4 bg-gradient-to-b from-gray-50 to-white border-t border-gray-100">
            <div
              ref={thumbnailRef}
              className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-2 [-webkit-overflow-scrolling:touch] [scroll-snap-type:x_mandatory]"
              style={{ scrollBehavior: "smooth" }}
            >
              {safeImages.map((img, idx) => (
                <button
                  key={img.id}
                  data-thumbnail
                  type="button"
                  onClick={() => {
                    setSelectedIndex(idx);
                    setIsLoading(true);
                  }}
                  className={clsx(
                    "relative shrink-0 rounded-xl overflow-hidden transition-all duration-500 scroll-snap-align-center border-2",
                    selectedIndex === idx
                      ? "border-[#FF5F15] ring-2 ring-[#FF5F15]/30 shadow-lg scale-105 z-10"
                      : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
                  )}
                  aria-label={`View image ${idx + 1}`}
                  aria-current={selectedIndex === idx ? "true" : "false"}
                  style={{ scrollSnapStop: "always" }}
                >
                  <div className="w-24 h-16 sm:w-28 sm:h-20">
                    <Image
                      src={img.src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                    {/* Hotel badge overlay */}
                    {img.type === "hotel" && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <HomeIcon className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Fullscreen Modal - Immersive Experience with z-1000 */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in"
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
            className="absolute top-6 right-6 z-[1005] p-3 rounded-full bg-white/10 text-white hover:bg-white/20 hover:scale-110 transition-all duration-300"
            aria-label="Close fullscreen"
          >
            <XMarkIcon className="w-7 h-7" />
          </button>

          {/* Fullscreen image container */}
          <div
            className="relative w-[95vw] max-w-7xl aspect-[16/10] bg-black rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div
              className={clsx(
                "relative w-full h-full transition-all duration-700 ease-out",
                !imageLoaded && isFullscreen ? "scale-105 opacity-0" : "scale-100 opacity-100"
              )}
            >
              <Image
                src={currentImage?.src || "/placeholder-image.jpg"}
                alt={`${name} - Fullscreen image ${selectedIndex + 1}`}
                fill
                className="object-contain"
                sizes="95vw"
                priority
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
              />
            </div>

            {/* Loading skeleton for fullscreen */}
            {isLoading && isFullscreen && (
              <div className="absolute inset-0 bg-linear-to-r from-gray-800 via-gray-700 to-gray-800 animate-shimmer" />
            )}

            {/* Navigation arrows */}
            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    showPrev();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-[1005] p-4 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 hover:scale-110 transition-all duration-300"
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-[1005] p-4 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 hover:scale-110 transition-all duration-300"
                  aria-label="Next image"
                >
                  <ChevronRightIcon className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Image info bar */}
            <div className="absolute bottom-0 left-0 right-0 px-8 py-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-white font-semibold text-xl">{name}</p>
                    <p className="text-white/70 text-sm flex items-center gap-2">
                      <span>{selectedIndex + 1} of {safeImages.length}</span>
                      {isHotelImage && (
                        <span className="inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                          <HomeIcon className="w-3 h-3" />
                          Hotel
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Thumbnail strip in fullscreen */}
                {hasMultipleImages && (
                  <div
                    className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-4 mx-[-32px] [-webkit-overflow-scrolling:touch] [scroll-snap-type:x_mandatory]"
                    style={{ scrollBehavior: "smooth" }}
                  >
                    {safeImages.map((img, idx) => (
                      <button
                        key={img.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedIndex(idx);
                          setIsLoading(true);
                        }}
                        className={clsx(
                          "relative shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-300 scroll-snap-align-center",
                          selectedIndex === idx
                            ? "border-white scale-110 shadow-lg ring-2 ring-white/30"
                            : "border-transparent opacity-50 hover:opacity-100 hover:scale-105"
                        )}
                        style={{ scrollSnapStop: "always" }}
                      >
                        <div className="w-20 h-14">
                          <Image
                            src={img.src}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                          {img.type === "hotel" && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <HomeIcon className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Keyboard hints */}
            <div className="absolute top-6 left-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-xl text-white/70 text-sm font-medium flex items-center gap-3">
              <span className="flex items-center gap-2">
                <ChevronLeftIcon className="w-4 h-4" />
                <ChevronRightIcon className="w-4 h-4" />
              </span>
              Navigate
            </div>
          </div>
        </div>
      )}
    </>
  );
}

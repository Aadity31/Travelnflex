import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { MapPinIcon, ClockIcon, PhotoIcon, StarIcon } from '@heroicons/react/24/solid';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface ImageData {
  url: string;
  alt: string;
  caption?: string;
}

interface HeroWithGalleryProps {
  title: string;
  location: string;
  duration: string;
  category: string;
  rating: number;
  reviewCount: number;
  images: ImageData[];
}

export default function HeroGridGallery({
  title,
  location,
  duration,
  category,
  rating,
  reviewCount,
  images,
}: HeroWithGalleryProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const imagesArray = images || [];
  const hasImages = imagesArray.length > 0;
  const hasMultipleImages = imagesArray.length > 1;
  const mainImage = hasImages ? imagesArray[mainImageIndex] : null;
  const gridImages = imagesArray;
  const totalImages = imagesArray.length;

  const getCurrentImage = useCallback(() => {
    if (currentImageIndex >= 0 && currentImageIndex < totalImages) {
      return imagesArray[currentImageIndex];
    }
    return imagesArray[0] || null;
  }, [currentImageIndex, totalImages, imagesArray]);

  const openLightbox = useCallback((index: number) => {
    if (index >= 0 && index < totalImages) {
      setCurrentImageIndex(index);
      setIsLightboxOpen(true);
      document.body.style.overflow = 'hidden';
    }
  }, [totalImages]);

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    document.body.style.overflow = 'unset';
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentImageIndex((prev) => {
      const newIndex = prev === 0 ? totalImages - 1 : prev - 1;
      return Math.max(0, Math.min(newIndex, totalImages - 1));
    });
  }, [totalImages]);

  const goToNext = useCallback(() => {
    setCurrentImageIndex((prev) => {
      const newIndex = prev === totalImages - 1 ? 0 : prev + 1;
      return Math.max(0, Math.min(newIndex, totalImages - 1));
    });
  }, [totalImages]);

  const handleThumbnailHover = (index: number) => {
    setMainImageIndex(index);
  };

  const handleGridMouseLeave = () => {
    setMainImageIndex(0);
  };

  const handleLightboxThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  useEffect(() => {
    if (!isLightboxOpen || !hasMultipleImages) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, hasMultipleImages, closeLightbox, goToPrevious, goToNext]);

  if (!hasImages || !mainImage) {
    return (
      <section className="relative w-full h-[60vh] min-h-[400px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden flex items-center justify-center">
        <div className="text-center px-8">
          <PhotoIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-700 mb-4">
            {title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-gray-600 text-sm">
            <span className="flex items-center gap-1.5">
              <MapPinIcon className="w-5 h-5" />
              {location}
            </span>
            <span className="flex items-center gap-1.5">
              <ClockIcon className="w-5 h-5" />
              {duration}
            </span>
          </div>
        </div>
      </section>
    );
  }

  const currentImage = getCurrentImage();
  const visibleThumbs = 6;
  const visibleGridImages = gridImages.slice(0, visibleThumbs);
  const remainingImages = Math.max(0, gridImages.length - visibleThumbs);

  return (
    <>
      <section className="relative w-full space-y-1">
        {/* Hero Image */}
        <div
          className="relative w-full h-[50vh] min-h-[400px] rounded-sm overflow-hidden group cursor-pointer"
          onClick={() => openLightbox(mainImageIndex)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && openLightbox(mainImageIndex)}
          aria-label={`View ${mainImage.alt} in gallery`}
        >
          <Image
            src={mainImage.url}
            alt={mainImage.alt}
            fill
            className="object-cover transition-all duration-300 group-hover:scale-105"
            priority
            sizes="100vw"
            key={mainImageIndex}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Rating Badge */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
            <span className="bg-white/95 backdrop-blur-sm text-gray-800 text-sm font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg">
              <StarIcon className="w-5 h-5 text-amber-400 drop-shadow-sm" />
              <span>{rating.toFixed(1)}</span>
              <span className="text-gray-500 font-medium text-xs">({reviewCount})</span>
            </span>
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-4 z-20">
            <span className="bg-black/60 backdrop-blur-sm text-white text-sm font-medium px-3 py-1.5 rounded-lg">
              {mainImageIndex + 1} / {totalImages}
            </span>
          </div>
        </div>

        {/* Grid of Thumbnails */}
        {gridImages.length > 0 && (
          <div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-1"
            onMouseLeave={handleGridMouseLeave}
          >
            {visibleGridImages.map((image, index) => {
              const actualIndex = index;
              const isLastVisible = index === visibleGridImages.length - 1;
              const shouldShowMoreBadge = isLastVisible && remainingImages > 0;
              const isActive = mainImageIndex === actualIndex;

              return (
                <div
                  key={actualIndex}
                  className={`relative aspect-video rounded-sm overflow-hidden group cursor-pointer transition-all duration-200 ${
                    isActive ? 'ring-2 ring-orange-500 ring-offset-2' : ''
                  }`}
                  onClick={() => openLightbox(actualIndex)}
                  onMouseEnter={() => handleThumbnailHover(actualIndex)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && openLightbox(actualIndex)}
                  aria-label={`View ${image.alt} in gallery`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  />
                  <div className={`absolute inset-0 transition-colors duration-300 ${
                    isActive ? 'bg-black/0' : 'bg-black/10 group-hover:bg-black/20'
                  }`} />

                  {shouldShowMoreBadge && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
                      <PhotoIcon className="w-8 h-8 mb-2" />
                      <span className="text-2xl font-bold">+{remainingImages}</span>
                      <span className="text-sm">More</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Professional Centered Popout Modal */}
      {isLightboxOpen && currentImage && (
        <div 
          className={`fixed inset-0 z-[9999] flex items-center justify-center p-8 md:p-12 lg:p-16 transition-opacity duration-300 ${
            isLightboxOpen ? 'opacity-100' : 'opacity-0'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
        >
          {/* Backdrop - Transparent Blur (Click to Close) */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-all duration-300"
            onClick={closeLightbox}
            aria-label="Close gallery by clicking outside"
          />

          {/* Professional Modal Card - Equal Margins All Sides */}
          <div 
            className={`relative w-full h-full max-w-[calc(100vw-10rem)] max-h-[calc(100vh-8rem backdrop-blur-xs rounded-xl shadow-[0_20px_80px_rgba(0,0,0,0.3)] overflow-hidden transform transition-all duration-500 ease-out ${
              isLightboxOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - Top Right, Outside Modal */}
            <button
              onClick={closeLightbox}
              className="absolute top-2 right-2 p-1 rounded-xl  backdrop-blur-md hover:bg-black/20 hover:text-orange-400 transition-all shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 z-10"
              aria-label="Close gallery"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>

            {/* Navigation Buttons - Outside Modal on Sides */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-xl backdrop-blur-md hover:bg-black/20 hover:text-orange-400 transition-all shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 hidden lg:flex items-center justify-center"
                  aria-label="Previous image"
                >
                  <ChevronLeftIcon className="w-7 h-7" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-xl backdrop-blur-md  hover:bg-black/20 hover:text-orange-400 transition-all shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 hidden lg:flex items-center justify-center"
                  aria-label="Next image"
                >
                  <ChevronRightIcon className="w-7 h-7" />
                </button>

                {/* Mobile Navigation - Inside Modal */}
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-gray-900 transition-all shadow-lg hover:scale-110 active:scale-95 lg:hidden z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-gray-900 transition-all shadow-lg hover:scale-110 active:scale-95 lg:hidden z-10"
                  aria-label="Next image"
                >
                  <ChevronRightIcon className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Modal Content - Flexible Layout */}
            <div className="flex flex-col h-full w-2xl">
              {/* Main Image Area */}
              <div className="flex-1 flex align-items-center justify-center p-4 ">
                <div className="relative w-full h-full">
                  <Image
                    src={currentImage.url}
                    alt={currentImage.alt}
                    fill
                    className="object-contain drop-shadow-2xl"
                    priority
                    sizes="100vw"
                  />
              {/* Thumbnail Grid */}
              <div className="border-t border-gray-200/50 px-4 py-2 bg-gray-50/50">
                <div className="max-w-full mx-auto">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                    {imagesArray.map((image, index) => {
                      const isActive = currentImageIndex === index;
                      return (
                        <div
                          key={index}
                          className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden cursor-pointer group transition-all duration-200 ${
                            isActive 
                              ? 'ring-3 ring-orange-500 ring-offset-2 ring-offset-gray-50 scale-105' 
                              : 'hover:scale-105 hover:ring-2 hover:ring-gray-400 opacity-60 hover:opacity-100'
                          }`}
                          onClick={() => handleLightboxThumbnailClick(index)}
                          onMouseEnter={() => handleLightboxThumbnailClick(index)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && handleLightboxThumbnailClick(index)}
                          aria-label={`View image ${index + 1}`}
                        >
                          <Image
                            src={image.url}
                            alt={image.alt}
                            fill
                            className="object-cover"
                            sizes="100px"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
                </div>
              </div>

             

            </div>
          </div>
        </div>
      )}
    </>
  );
}
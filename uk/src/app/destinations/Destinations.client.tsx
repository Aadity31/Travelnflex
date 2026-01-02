"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import FilterSidebar from "@/app/components/filters/FilterSidebar";
import MobileFilterSidebar from "@/app/components/filters/MobileFilterSidebar";
import { SearchFilters } from "@/types";
import {
  StarIcon,
  MapPinIcon,
  ClockIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

/* ---------------- TYPES ---------------- */

export interface DestinationCard {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  image: string;
  location: string;
  rating: number;
  reviewCount: number;
  highlights?: string[];
  bestTimeToVisit?: string;
  createdAt: string; // cursor
  price?: number;
}

/* ---------------- COMPONENT ---------------- */

export default function DestinationsClient({
  initialDestinations,
}: {
  initialDestinations: DestinationCard[];
}) {
  /* -------- LOGIC STATE -------- */

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});

  const [destinations, setDestinations] = useState<DestinationCard[]>(
    initialDestinations ?? []
  );

  const [cursor, setCursor] = useState<{
    createdAt: string;
    id: string;
  } | null>(() => {
    const last = initialDestinations?.at(-1);
    return last ? { createdAt: last.createdAt, id: last.id } : null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setHasMore(true);
  }, []);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  /* ---------------- INFINITE SCROLL LOGIC ---------------- */

  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || isLoading) return;

        setIsLoading(true);

        try {
          const url = cursor
            ? `/api/destinations?createdAt=${encodeURIComponent(
                cursor.createdAt
              )}&id=${encodeURIComponent(cursor.id)}`
            : `/api/destinations`;

          const res = await fetch(url);
          if (!res.ok) throw new Error("API failed");

          const next: DestinationCard[] = await res.json();

          if (next.length === 0) {
            setHasMore(false);
            return;
          }

          const last = next.at(-1);

          setDestinations((prev) => [...prev, ...next]);
          setCursor(last ? { createdAt: last.createdAt, id: last.id } : null);
        } catch (err) {
          console.error("Destinations infinite scroll failed:", err);
          setHasMore(false);
        } finally {
          setIsLoading(false);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [cursor, hasMore, isLoading]);

  /* ---------------- FILTER LOGIC ---------------- */

  const filteredDestinations = useMemo(() => {
    return destinations.filter((destination) => {
      // 1. Location Search Filter
      if (
        filters.location &&
        !destination.name
          .toLowerCase()
          .includes(filters.location.toLowerCase()) &&
        !destination.location
          .toLowerCase()
          .includes(filters.location.toLowerCase())
      ) {
        return false;
      }

      // 2. Price Range Filter
      if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        const destPrice = destination.price ?? 0;

        if (destPrice < min || destPrice > max) {
          return false;
        }
      }

      // 3. Rating Filter
      if (filters.ratings && filters.ratings.length > 0) {
        const meetsRating = filters.ratings.some(
          (minRating) => destination.rating >= minRating
        );
        if (!meetsRating) return false;
      }

      return true;
    });
  }, [filters, destinations]);

  /* ---------------- UI ---------------- */

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-48 sm:h-56 md:h-64 lg:h-72 bg-gradient-to-r from-orange-600 to-red-600 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4">
            Sacred Destinations
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto">
            Explore the spiritual heartland of India
          </p>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        {/* --- EXISTING MOBILE FILTER BUTTON (Don't change this) --- */}
        <div className="lg:hidden mb-4 sm:mb-6">
          <button
            onClick={() => setShowFilters(true)}
            className="relative flex items-center justify-center gap-2 w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg shadow-md transition-colors text-sm sm:text-base"
          >
            <FunnelIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            Filters
          </button>
        </div>

        {/* --- NEW: ACTIVE FILTERS DISPLAY (Mobile Only) --- */}
        <div className="lg:hidden flex flex-wrap gap-2 mb-6 empty:mb-0">
          {/* Location Tag */}
          {filters.location && (
            <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 border border-gray-200 px-2 py-1 rounded-full text-xs font-medium">
              📍 {filters.location}
              <button
                onClick={() => setFilters({ ...filters, location: undefined })}
                className="p-0.5 hover:bg-gray-200 rounded-full"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Activity Types Tags */}
          {filters.activityTypes?.map((type) => (
            <span
              key={type}
              className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 border border-orange-100 px-2 py-1 rounded-full text-xs font-medium capitalize"
            >
              {type}
              <button
                onClick={() =>
                  setFilters({
                    ...filters,
                    activityTypes: filters.activityTypes?.filter(
                      (t) => t !== type
                    ),
                  })
                }
                className="p-0.5 hover:bg-orange-100 rounded-full"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Difficulty Tags */}
          {filters.difficulties?.map((diff) => (
            <span
              key={diff}
              className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1 rounded-full text-xs font-medium capitalize"
            >
              {diff}
              <button
                onClick={() =>
                  setFilters({
                    ...filters,
                    difficulties: filters.difficulties?.filter(
                      (d) => d !== diff
                    ),
                  })
                }
                className="p-0.5 hover:bg-blue-100 rounded-full"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Price Range Tag */}
          {filters.priceRange && (
            <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-100 px-2 py-1 rounded-full text-xs font-medium">
              ₹{filters.priceRange[0]} -{" "}
              {filters.priceRange[1] >= 50000
                ? "50k+"
                : `₹${filters.priceRange[1]}`}
              <button
                onClick={() =>
                  setFilters({ ...filters, priceRange: undefined })
                }
                className="p-0.5 hover:bg-green-100 rounded-full"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Rating Tags */}
          {filters.ratings?.map((rating) => (
            <span
              key={rating}
              className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 border border-yellow-100 px-2 py-1 rounded-full text-xs font-medium"
            >
              ★ {rating}+
              <button
                onClick={() =>
                  setFilters({
                    ...filters,
                    ratings: filters.ratings?.filter((r) => r !== rating),
                  })
                }
                className="p-0.5 hover:bg-yellow-100 rounded-full"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* Clear All Link (Only shows if something is selected) */}
          {(filters.location ||
            filters.priceRange ||
            (filters.activityTypes?.length ?? 0) > 0 ||
            (filters.difficulties?.length ?? 0) > 0 ||
            (filters.ratings?.length ?? 0) > 0) && (
            <button
              onClick={() => setFilters({})}
              className="text-xs text-gray-500 underline ml-1 self-center"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-10">
          {/* Sidebar Filters - Desktop Only */}
          <div className="hidden lg:block lg:w-64 xl:w-72 2xl:w-80 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFilterChange={setFilters}
              filteredCount={filteredDestinations.length}
              // CUSTOMIZE FOR DESTINATIONS:
              showActivityTypes={false}
              showDifficulty={false}
              showPrice={true}
              showRating={true}
            />
          </div>

          {/* Destinations List */}
          <div className="flex-1">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6">
              {filteredDestinations.length} Destinations
            </h2>

            <div className="flex flex-col gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {filteredDestinations.map((destination, index) => (
                <article
                  key={destination.id}
                  className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row"
                >
                  {/* Image Section */}
                  <div className="relative w-full sm:w-64 md:w-80 lg:w-96 h-48 sm:h-auto flex-shrink-0">
                    <Image
                      src={destination.image}
                      alt={destination.name}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 640px) 100vw, 400px"
                      className="object-cover"
                    />
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 p-2.5 sm:p-3 md:p-4 flex flex-col">
                    <div className="flex-1">
                      {/* Title and Rating */}
                      <div className="mb-1.5">
                        <div className="flex items-start justify-between gap-2 mb-0.5">
                                                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 hover:text-orange-600 transition-colors line-clamp-1">
                             <Link
                              href={`/booking/destination/${destination.slug}`}
                            >
                              {destination.name}
                            </Link>
                          </h3>


                          {/* Rating Badge */}
                          <div className="flex items-center gap-0.5 bg-blue-600 text-white px-1.5 py-0.5 rounded flex-shrink-0">
                            <span className="text-[10px] sm:text-xs font-bold">
                              {destination.rating}
                            </span>
                            <StarIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-gray-600 text-[10px] sm:text-xs">
                          <MapPinIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span className="line-clamp-1">
                            {destination.location}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                        {destination.shortDescription}
                      </p>

                      {/* Highlights */}
                      <div className="mb-2">
                        <div className="flex flex-wrap gap-1.5">
                          {(destination.highlights ?? [])
                            .slice(0, 3)
                            .map((highlight, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-0.5 text-[10px] sm:text-xs text-gray-700"
                              >
                                <div className="w-1 h-1 bg-orange-500 rounded-full flex-shrink-0" />
                                <span className="line-clamp-1">
                                  {highlight}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Best Time */}
                      <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-600">
                        <ClockIcon className="w-3 h-3" />
                        <span>Best: {destination.bestTimeToVisit}</span>
                      </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="flex items-end justify-between mt-2 pt-2 border-t border-gray-200">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500">
                          ({destination.reviewCount} Reviews)
                        </span>
                      </div>

                      <Link
  href={`/booking/destination/${destination.slug}`}
  className="bg-orange-600 hover:bg-orange-700 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg font-semibold transition-colors duration-200 text-xs whitespace-nowrap"
>
  Explore
</Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Infinite scroll trigger */}
            <div ref={loaderRef} className="h-10" />

            {isLoading && (
              <div className="text-center py-6 text-gray-500">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Ready to Begin Your Sacred Journey?
          </h2>
          <p className="text-base md:text-lg mb-6">
            Let our expert local guides create unforgettable experiences
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-orange-600 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            Contact Guide
          </Link>
        </div>
      </section>

      {/* Mobile Sidebar */}
      <MobileFilterSidebar
        filters={filters}
        onFilterChange={setFilters}
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        showActivityTypes={false}
        showDifficulty={false}
        showPrice={true}
        showRating={true}
      />
    </main>
  );
}

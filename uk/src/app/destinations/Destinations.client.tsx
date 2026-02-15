"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import FilterSidebar from "@/components/filters/FilterSidebar";
import MobileFilterSidebar from "@/components/filters/MobileFilterSidebar";
import { SearchFilters } from "@/types";
import DestinationCard from "@/components/destinations/DestinationCard";
import { useWishlistStore } from "@/lib/wishlist/store";
import LoginPrompt from "@/components/auth/LoginPrompt";

import {
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
  popularActivities?: string[];
  bestTimeToVisit?: string;
  createdAt: string; // cursor
  startingPrice: number;
  discount?: {
    percentage: number;
    validUntil: string;
  };
  badgeText?: string;
  badgeType?: string;
}

/* ---------------- COMPONENT ---------------- */

export default function DestinationsClient({
  initialDestinations,
}: {
  initialDestinations: DestinationCard[];
}) {
  const wishlist = useWishlistStore();

  //  repeated bulk calls
  const fetchedRef = useRef(false);

  /* -------- LOGIC STATE -------- */

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});

  const [destinations, setDestinations] = useState<DestinationCard[]>(
    initialDestinations ?? [],
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

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter((v) => {
      if (Array.isArray(v)) return v.length > 0;
      return !!v;
    }).length;
  }, [filters]);

  useEffect(() => {
    setHasMore(true);
  }, []);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const ids = initialDestinations.map((d) => d.id);
    wishlist.fetchBulk(ids);
  }, [initialDestinations, wishlist]);

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
                cursor.createdAt,
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
          wishlist.fetchBulk(next.map((d) => d.id));
          setCursor(last ? { createdAt: last.createdAt, id: last.id } : null);
        } catch (err) {
          console.error("Destinations infinite scroll failed:", err);
          setHasMore(false);
        } finally {
          setIsLoading(false);
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        const destPrice = destination.startingPrice ?? 0;

        if (destPrice < min || destPrice > max) {
          return false;
        }
      }

      // 3. Rating Filter
      if (filters.ratings && filters.ratings.length > 0) {
        const meetsRating = filters.ratings.some(
          (minRating) => destination.rating >= minRating,
        );
        if (!meetsRating) return false;
      }

      return true;
    });
  }, [filters, destinations]);

  /* ---------------- UI ---------------- */

  return (
    <>
      <main className="min-h-screen bg-gray-50">
        <LoginPrompt open={wishlist.showLogin} onClose={wishlist.closeLogin} />

        

        <div className="max-w-[1440px] mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
          {/* --- EXISTING MOBILE FILTER BUTTON (Don't change this) --- */}
          <div className="lg:hidden mb-4 sm:mb-6">
            <button
              onClick={() => setShowFilters(true)}
              className="relative flex items-center justify-center gap-2 w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg shadow-md transition-colors text-sm sm:text-base"
            >
              <FunnelIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* --- ACTIVE FILTERS DISPLAY (Mobile Only) --- */}
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
                {filteredDestinations.map((destination) => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                    isLiked={wishlist.get(destination.id)}
                    onWishlistToggle={() => wishlist.toggle(destination.id)}
                  />
                ))}
              </div>

              {/* Infinite scroll trigger */}
              <div ref={loaderRef} className="h-10" />

              {/* Infinite scroll loading - Local loading indicator */}
              {isLoading && (
                <div className="text-center py-6 sm:py-8">
                  <div className="inline-block h-6 w-6 sm:h-8 sm:w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
                  <p className="mt-2 text-gray-500 text-sm sm:text-base">
                    Loading more destinations...
                  </p>
                </div>
              )}

              {/* No Results */}
              {filteredDestinations.length === 0 && (
                <div className="text-center py-12 sm:py-16">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                    No destinations found
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                    Try adjusting your filters to see more results
                  </p>
                  <button
                    onClick={() => setFilters({})}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors duration-200 text-sm sm:text-base"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        

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
    </>
  );
}

"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  StarIcon,
  ClockIcon,
  MapPinIcon,
  FunnelIcon,
} from "@heroicons/react/24/solid";
import type { Activity, SearchFilters } from "@/app/types";
import ActivityFilters from "@/app/components/filters/ActivityFilters";
import MobileActivityFilters from "@/app/components/filters/MobileActivityFilters";
import LoadingOverlay from "@/app/components/LoadingOverlay";
import { useLoading } from "@/lib/use-loading";

export default function ActivitiesClient({
  initialActivities,
}: {
  initialActivities: Activity[];
}) {
  const { showLoading, hideLoading } = useLoading();

  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [cursor, setCursor] = useState<string | null>(() => {
    const last = initialActivities.at(-1);
    return last ? new Date(last.createdAt).toISOString() : null;
  });

  // PAGE LOAD PE LOADING SHOW KARO
  useEffect(() => {
    showLoading("Loading activities..."); // START LOADING

    // Simulate data loading or wait for something
    setTimeout(() => {
      hideLoading(); // STOP LOADING after some time
    }, 2000);

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      if (filters.activityTypes && filters.activityTypes.length > 0) {
        if (!filters.activityTypes.includes(activity.type)) return false;
      }

      if (filters.difficulties && filters.difficulties.length > 0) {
        if (!filters.difficulties.includes(activity.difficulty)) return false;
      }

      if (
        filters.location &&
        !activity.location
          .toLowerCase()
          .includes(filters.location.toLowerCase())
      )
        return false;

      if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        if (activity.price.min > max || activity.price.max < min) return false;
      }

      if (filters.ratings && filters.ratings.length > 0) {
        const meetsRating = filters.ratings.some(
          (minRating) => activity.rating >= minRating
        );
        if (!meetsRating) return false;
      }

      return true;
    });
  }, [filters, activities]);

  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(Boolean).length;
  }, [filters]);

  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || isLoading) return;

        setIsLoading(true);

        try {
          const url = cursor
            ? `/api/activities?cursor=${encodeURIComponent(cursor)}`
            : `/api/activities`;

          const res = await fetch(url);
          if (!res.ok) throw new Error("API failed");

          const next: Activity[] = await res.json();

          if (next.length === 0) {
            setHasMore(false);
            return;
          }
          const last = next.at(-1);
          setActivities((prev) => [...prev, ...next]);
          setCursor(last ? new Date(last.createdAt).toISOString() : null);
        } catch (err) {
          console.error("Infinite scroll failed:", err);
          setHasMore(false);
        } finally {
          setIsLoading(false);
        }
      },
      {
        rootMargin: "200px",
      }
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [cursor, hasMore, isLoading]);

  return (
    <>
      <LoadingOverlay />
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section - RESPONSIVE */}
        <section className="relative h-48 sm:h-56 md:h-64 lg:h-72 bg-gradient-to-r from-green-600 to-blue-600 flex items-center justify-center">
          <div className="text-center text-white px-4 sm:px-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4">
              Adventure & Spiritual Activities
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-xs sm:max-w-md md:max-w-2xl mx-auto">
              Discover a perfect blend of thrilling adventures and
              soul-enriching spiritual experiences
            </p>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
          {/* Mobile Filter Button - RESPONSIVE */}
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

          {/* Layout - RESPONSIVE */}
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 md:gap-6">
            {/* Desktop Filters */}
            <div className="hidden lg:block">
              <ActivityFilters
                filters={filters}
                onFilterChange={setFilters}
                filteredCount={filteredActivities.length}
              />
            </div>

            {/* Activities List - RESPONSIVE */}
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6">
                {filteredActivities.length} Activities
              </h2>

              {/* Cards - RESPONSIVE */}
              <div className="flex flex-col gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                {filteredActivities.map((activity) => (
                  <article
                    key={activity.id}
                    className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row"
                  >
                    {/* Image Section - RESPONSIVE */}
                    <div className="relative w-full sm:w-64 md:w-80 lg:w-96 h-48 sm:h-52 md:h-56 lg:h-64 flex-shrink-0">
                      <Image
                        src={activity.images[0]}
                        alt={activity.name}
                        fill
                        className="object-cover"
                      />

                      {/* Type Badge - RESPONSIVE */}
                      <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                        <span
                          className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-semibold text-white shadow-md ${
                            activity.type === "adventure"
                              ? "bg-red-500"
                              : activity.type === "spiritual"
                              ? "bg-purple-500"
                              : activity.type === "cultural"
                              ? "bg-blue-500"
                              : "bg-green-500"
                          }`}
                        >
                          {activity.type
                            ? activity.type.charAt(0).toUpperCase() +
                              activity.type.slice(1)
                            : ""}
                        </span>
                      </div>

                      {/* Image Thumbnails - RESPONSIVE */}
                      <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 flex gap-1">
                        {activity.images.slice(0, 4).map((img, idx) => (
                          <div
                            key={idx}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-md overflow-hidden border-2 border-white shadow-sm"
                          >
                            <Image
                              src={img}
                              alt={`${activity.name} ${idx + 1}`}
                              width={48}
                              height={48}
                              className="object-cover"
                            />
                          </div>
                        ))}
                        {activity.images.length > 4 && (
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-black/60 backdrop-blur-sm border-2 border-white flex items-center justify-center">
                            <span className="text-white text-xs font-semibold">
                              +{activity.images.length - 4}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Content Section - RESPONSIVE */}
                    <div className="flex-1 p-3 sm:p-4 md:p-5 flex flex-col">
                      <div className="flex-1">
                        {/* Title and Location - RESPONSIVE */}
                        <div className="mb-2">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 hover:text-orange-600 transition-colors line-clamp-2">
                              <Link href={`/activities/${activity.slug}`}>
                                {activity.name}
                              </Link>
                            </h3>

                            {/* Rating Badge - RESPONSIVE */}
                            <div className="flex items-center gap-0.5 sm:gap-1 bg-blue-600 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg flex-shrink-0">
                              <span className="text-xs sm:text-sm font-bold">
                                {activity.rating}
                              </span>
                              <StarIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </div>
                          </div>

                          <div className="flex items-center gap-1 sm:gap-1.5 text-gray-600 text-xs sm:text-sm">
                            <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="line-clamp-1">
                              {activity.location}
                            </span>
                          </div>
                        </div>

                        {/* Description - RESPONSIVE */}
                        <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
                          {activity.description}
                        </p>

                        {/* Features/Includes - RESPONSIVE */}
                        <div className="mb-2 sm:mb-3">
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {activity.includes
                              .slice(0, 3)
                              .map((item, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-0.5 sm:gap-1 text-xs text-gray-700"
                                >
                                  <svg
                                    className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span className="line-clamp-1">{item}</span>
                                </div>
                              ))}
                            {activity.includes.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{activity.includes.length - 3}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Duration - RESPONSIVE */}
                        <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-gray-600">
                          <ClockIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{activity.duration}</span>
                        </div>
                      </div>

                      {/* Bottom Section - Price & Button - RESPONSIVE */}
                      <div className="flex items-end justify-between mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
                        <div>
                          <div className="text-xs text-gray-500 line-through">
                            ₹{Math.round(activity.price.min * 1.2)}
                          </div>
                          <div className="flex items-baseline gap-0.5 sm:gap-1">
                            <span className="text-xl sm:text-2xl font-bold text-gray-900">
                              ₹{activity.price.min}
                            </span>
                            {activity.price.min !== activity.price.max && (
                              <span className="text-xs sm:text-sm text-gray-600">
                                - ₹{activity.price.max}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500">Per Night</div>
                        </div>

                        <Link
                          href={`/activities/${activity.slug}`}
                          className="bg-orange-600 hover:bg-orange-700 text-white py-2 sm:py-2.5 px-4 sm:px-6 rounded-lg font-semibold transition-colors duration-200 text-xs sm:text-sm whitespace-nowrap"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div ref={loaderRef} className="h-10" />

              {/* Infinite scroll loading - Local loading indicator */}
              {isLoading && (
                <div className="text-center py-6 sm:py-8">
                  <div className="inline-block h-6 w-6 sm:h-8 sm:w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
                  <p className="mt-2 text-gray-500 text-sm sm:text-base">
                    Loading more activities...
                  </p>
                </div>
              )}

              {/* No Results - RESPONSIVE */}
              {filteredActivities.length === 0 && (
                <div className="text-center py-12 sm:py-16">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                    No activities found
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                    Try adjusting your filters to see more results
                  </p>
                  <button
                    onClick={() => setFilters({})}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filters */}
        <MobileActivityFilters
          filters={filters}
          onFilterChange={setFilters}
          isOpen={showFilters}
          onClose={() => setShowFilters(false)}
        />
      </main>
    </>
  );
}

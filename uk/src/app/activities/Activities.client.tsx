"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  StarIcon,
  ClockIcon,
  MapPinIcon,
  XMarkIcon,
  FunnelIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";
import type { Activity, SearchFilters } from "@/app/types";
import { Listbox, Transition } from "@headlessui/react";
import { Fragment } from "react";

const activityTypes = [
  { value: "", label: "All Activities" },
  { value: "adventure", label: "Adventure" },
  { value: "spiritual", label: "Spiritual" },
  { value: "cultural", label: "Cultural" },
  { value: "trekking", label: "Trekking" },
  { value: "food", label: "Food" },
] as const;

const difficultyLevels = [
  { value: "", label: "All Levels" },
  { value: "easy", label: "Easy" },
  { value: "moderate", label: "Moderate" },
  { value: "difficult", label: "Difficult" },
] as const;

const ratingOptions = [
  { value: "", label: "All Ratings" },
  { value: 4.5, label: "4.5+ Stars" },
  { value: 4.0, label: "4.0+ Stars" },
  { value: 3.5, label: "3.5+ Stars" },
] as const;

export default function ActivitiesClient({
  initialActivities,
}: {
  initialActivities: Activity[];
}) {
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

  // Hover states for each dropdown
  const [hoverStates, setHoverStates] = useState({
    activityType: false,
    difficulty: false,
    rating: false,
  });

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      if (filters.activityType && activity.type !== filters.activityType)
        return false;
      if (filters.difficulty && activity.difficulty !== filters.difficulty)
        return false;
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
      if (filters.rating && activity.rating < filters.rating) return false;
      return true;
    });
  }, [filters, activities]);

  const updateFilter = <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    setFilters(
      (prev) => ({ ...(prev as object), [key]: value } as SearchFilters)
    );
  };

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
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-64 bg-gradient-to-r from-green-600 to-blue-600 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Adventure & Spiritual Activities
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Discover a perfect blend of thrilling adventures and soul-enriching
            spiritual experiences
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {filteredActivities.length} Activities
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden relative flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-4 py-2.5 rounded-lg shadow-md transition-colors"
            >
              <FunnelIcon className="w-5 h-5" />
              Filters
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Activity Type */}
            <div
              onMouseEnter={() =>
                setHoverStates((prev) => ({ ...prev, activityType: true }))
              }
              onMouseLeave={() =>
                setHoverStates((prev) => ({ ...prev, activityType: false }))
              }
            >
              <Listbox
                value={
                  activityTypes.find((t) => t.value === filters.activityType) ??
                  activityTypes[0]
                }
                onChange={(item) => {
                  updateFilter(
                    "activityType",
                    item.value === "" ? undefined : item.value
                  );
                  setHoverStates((prev) => ({ ...prev, activityType: false }));
                }}
              >
                {({ open }) => (
                  <div className="relative">
                    <Listbox.Button
                      className={`w-full border-2 rounded-lg px-4 py-2.5 bg-white text-gray-900 text-sm font-medium shadow-sm transition-all outline-none text-left flex items-center justify-between ${
                        open || hoverStates.activityType
                          ? "border-orange-500 ring-2 ring-orange-200"
                          : "border-gray-300 hover:border-orange-400"
                      }`}
                    >
                      <span>
                        {activityTypes.find(
                          (t) => t.value === filters.activityType
                        )?.label ?? "All Activities"}
                      </span>
                      <ChevronDownIcon
                        className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                          open || hoverStates.activityType ? "rotate-180" : ""
                        }`}
                      />
                    </Listbox.Button>

                    <Transition
                      show={open || hoverStates.activityType}
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Listbox.Options className="absolute z-50 mt-2 w-full max-h-60 overflow-auto rounded-lg bg-white shadow-xl border border-gray-200">
                        {activityTypes.map((type) => (
                          <Listbox.Option
                            key={type.value}
                            value={type}
                            className={({ active, selected }) =>
                              `cursor-pointer px-4 py-2.5 text-sm transition-colors ${
                                selected
                                  ? "bg-orange-600 text-white font-semibold"
                                  : active
                                  ? "bg-orange-50 text-orange-700"
                                  : "text-gray-900 hover:bg-gray-50"
                              }`
                            }
                          >
                            {type.label}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                )}
              </Listbox>
            </div>

            {/* Difficulty Level */}
            <div
              onMouseEnter={() =>
                setHoverStates((prev) => ({ ...prev, difficulty: true }))
              }
              onMouseLeave={() =>
                setHoverStates((prev) => ({ ...prev, difficulty: false }))
              }
            >
              <Listbox
                value={
                  difficultyLevels.find(
                    (l) => l.value === filters.difficulty
                  ) ?? difficultyLevels[0]
                }
                onChange={(item) => {
                  updateFilter(
                    "difficulty",
                    item.value === "" ? undefined : item.value
                  );
                  setHoverStates((prev) => ({ ...prev, difficulty: false }));
                }}
              >
                {({ open }) => (
                  <div className="relative">
                    <Listbox.Button
                      className={`w-full border-2 rounded-lg px-4 py-2.5 bg-white text-gray-900 text-sm font-medium shadow-sm transition-all outline-none text-left flex items-center justify-between ${
                        open || hoverStates.difficulty
                          ? "border-orange-500 ring-2 ring-orange-200"
                          : "border-gray-300 hover:border-orange-400"
                      }`}
                    >
                      <span>
                        {difficultyLevels.find(
                          (l) => l.value === filters.difficulty
                        )?.label ?? "All Levels"}
                      </span>
                      <ChevronDownIcon
                        className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                          open || hoverStates.difficulty ? "rotate-180" : ""
                        }`}
                      />
                    </Listbox.Button>

                    <Transition
                      show={open || hoverStates.difficulty}
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Listbox.Options className="absolute z-50 mt-2 w-full max-h-60 overflow-auto rounded-lg bg-white shadow-xl border border-gray-200">
                        {difficultyLevels.map((level) => (
                          <Listbox.Option
                            key={level.value}
                            value={level}
                            className={({ active, selected }) =>
                              `cursor-pointer px-4 py-2.5 text-sm transition-colors ${
                                selected
                                  ? "bg-orange-600 text-white font-semibold"
                                  : active
                                  ? "bg-orange-50 text-orange-700"
                                  : "text-gray-900 hover:bg-gray-50"
                              }`
                            }
                          >
                            {level.label}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                )}
              </Listbox>
            </div>

            {/* Location */}
            <input
              type="text"
              placeholder="Search location..."
              value={filters.location || ""}
              onChange={(e) =>
                updateFilter(
                  "location",
                  (e.target.value as SearchFilters["location"]) || undefined
                )
              }
              className="w-full border-2 border-gray-300 hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-lg px-4 py-2.5 bg-white text-gray-900 text-sm font-medium placeholder:text-gray-500 shadow-sm transition-all outline-none"
            />

            {/* Rating */}
            <div
              onMouseEnter={() =>
                setHoverStates((prev) => ({ ...prev, rating: true }))
              }
              onMouseLeave={() =>
                setHoverStates((prev) => ({ ...prev, rating: false }))
              }
            >
              <Listbox
                value={
                  ratingOptions.find((r) => r.value === filters.rating) ??
                  ratingOptions[0]
                }
                onChange={(item) => {
                  updateFilter(
                    "rating",
                    item.value === "" ? undefined : item.value
                  );
                  setHoverStates((prev) => ({ ...prev, rating: false }));
                }}
              >
                {({ open }) => (
                  <div className="relative">
                    <Listbox.Button
                      className={`w-full border-2 rounded-lg px-4 py-2.5 bg-white text-gray-900 text-sm font-medium shadow-sm transition-all outline-none text-left flex items-center justify-between ${
                        open || hoverStates.rating
                          ? "border-orange-500 ring-2 ring-orange-200"
                          : "border-gray-300 hover:border-orange-400"
                      }`}
                    >
                      <span>
                        {ratingOptions.find((r) => r.value === filters.rating)
                          ?.label ?? "All Ratings"}
                      </span>
                      <ChevronDownIcon
                        className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                          open || hoverStates.rating ? "rotate-180" : ""
                        }`}
                      />
                    </Listbox.Button>

                    <Transition
                      show={open || hoverStates.rating}
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Listbox.Options className="absolute z-50 mt-2 w-full max-h-60 overflow-auto rounded-lg bg-white shadow-xl border border-gray-200">
                        {ratingOptions.map((r) => (
                          <Listbox.Option
                            key={r.label}
                            value={r}
                            className={({ active, selected }) =>
                              `cursor-pointer px-4 py-2.5 text-sm transition-colors ${
                                selected
                                  ? "bg-orange-600 text-white font-semibold"
                                  : active
                                  ? "bg-orange-50 text-orange-700"
                                  : "text-gray-900 hover:bg-gray-50"
                              }`
                            }
                          >
                            {r.label}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                )}
              </Listbox>
            </div>
          </div>

          {/* Active Filters Tags */}
          {activeFiltersCount > 0 && (
            <div className="hidden lg:flex flex-wrap gap-2 mt-4">
              {filters.activityType && (
                <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  {
                    activityTypes.find((t) => t.value === filters.activityType)
                      ?.label
                  }
                  <button
                    onClick={() => updateFilter("activityType", undefined)}
                    className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </span>
              )}
              {filters.difficulty && (
                <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  {
                    difficultyLevels.find((l) => l.value === filters.difficulty)
                      ?.label
                  }
                  <button
                    onClick={() => updateFilter("difficulty", undefined)}
                    className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </span>
              )}
              {filters.location && (
                <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  {filters.location}
                  <button
                    onClick={() => updateFilter("location", undefined)}
                    className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </span>
              )}
              {filters.rating && (
                <span className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-sm font-medium">
                  {ratingOptions.find((r) => r.value === filters.rating)?.label}
                  <button
                    onClick={() => updateFilter("rating", undefined)}
                    className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </span>
              )}
              <button
                onClick={() => setFilters({})}
                className="text-sm text-gray-600 hover:text-orange-600 font-medium underline transition-colors"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Mobile Filters - Bottom Sheet */}
          <Transition show={showFilters} as={Fragment}>
            <div className="lg:hidden fixed inset-0 z-50">
              {/* Backdrop */}
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div
                  className="fixed inset-0 bg-black/50"
                  onClick={() => setShowFilters(false)}
                />
              </Transition.Child>

              {/* Drawer */}
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-out duration-300"
                enterFrom="translate-y-full"
                enterTo="translate-y-0"
                leave="transform transition ease-in duration-200"
                leaveFrom="translate-y-0"
                leaveTo="translate-y-full"
              >
                <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto">
                  {/* Header */}
                  <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between rounded-t-3xl z-10">
                    <h3 className="text-lg font-bold text-gray-900">
                      Filter Activities
                    </h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>

                  {/* Filter Options */}
                  <div className="p-5 space-y-5">
                    {/* Activity Type */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Activity Type
                      </label>
                      <Listbox
                        value={
                          activityTypes.find(
                            (t) => t.value === filters.activityType
                          ) ?? activityTypes[0]
                        }
                        onChange={(item) =>
                          updateFilter(
                            "activityType",
                            item.value === "" ? undefined : item.value
                          )
                        }
                      >
                        {({ open }) => (
                          <div className="relative">
                            <Listbox.Button
                              className={`w-full border-2 rounded-lg px-4 py-3 bg-white text-gray-900 text-sm font-medium shadow-sm outline-none text-left flex items-center justify-between ${
                                open
                                  ? "border-orange-500 ring-2 ring-orange-200"
                                  : "border-gray-300"
                              }`}
                            >
                              <span>
                                {activityTypes.find(
                                  (t) => t.value === filters.activityType
                                )?.label ?? "All Activities"}
                              </span>
                              <ChevronDownIcon
                                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                                  open ? "rotate-180" : ""
                                }`}
                              />
                            </Listbox.Button>

                            <Listbox.Options className="absolute z-50 mt-2 w-full max-h-56 overflow-auto rounded-lg bg-white shadow-xl border border-gray-200">
                              {activityTypes.map((type) => (
                                <Listbox.Option
                                  key={type.value}
                                  value={type}
                                  className={({ active, selected }) =>
                                    `cursor-pointer px-4 py-3 text-sm transition-colors ${
                                      selected
                                        ? "bg-orange-600 text-white font-semibold"
                                        : active
                                        ? "bg-orange-50 text-orange-700"
                                        : "text-gray-900"
                                    }`
                                  }
                                >
                                  {type.label}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </div>
                        )}
                      </Listbox>
                    </div>

                    {/* Difficulty Level */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Difficulty Level
                      </label>
                      <Listbox
                        value={
                          difficultyLevels.find(
                            (l) => l.value === filters.difficulty
                          ) ?? difficultyLevels[0]
                        }
                        onChange={(item) =>
                          updateFilter(
                            "difficulty",
                            item.value === "" ? undefined : item.value
                          )
                        }
                      >
                        {({ open }) => (
                          <div className="relative">
                            <Listbox.Button
                              className={`w-full border-2 rounded-lg px-4 py-3 bg-white text-gray-900 text-sm font-medium shadow-sm outline-none text-left flex items-center justify-between ${
                                open
                                  ? "border-orange-500 ring-2 ring-orange-200"
                                  : "border-gray-300"
                              }`}
                            >
                              <span>
                                {difficultyLevels.find(
                                  (l) => l.value === filters.difficulty
                                )?.label ?? "All Levels"}
                              </span>
                              <ChevronDownIcon
                                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                                  open ? "rotate-180" : ""
                                }`}
                              />
                            </Listbox.Button>

                            <Listbox.Options className="absolute z-50 mt-2 w-full max-h-56 overflow-auto rounded-lg bg-white shadow-xl border border-gray-200">
                              {difficultyLevels.map((level) => (
                                <Listbox.Option
                                  key={level.value}
                                  value={level}
                                  className={({ active, selected }) =>
                                    `cursor-pointer px-4 py-3 text-sm transition-colors ${
                                      selected
                                        ? "bg-orange-600 text-white font-semibold"
                                        : active
                                        ? "bg-orange-50 text-orange-700"
                                        : "text-gray-900"
                                    }`
                                  }
                                >
                                  {level.label}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </div>
                        )}
                      </Listbox>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        placeholder="Search location..."
                        value={filters.location || ""}
                        onChange={(e) =>
                          updateFilter(
                            "location",
                            (e.target.value as SearchFilters["location"]) ||
                              undefined
                          )
                        }
                        className="w-full border-2 border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-lg px-4 py-3 bg-white text-gray-900 text-sm font-medium placeholder:text-gray-500 shadow-sm transition-all outline-none"
                      />
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Minimum Rating
                      </label>
                      <Listbox
                        value={
                          ratingOptions.find(
                            (r) => r.value === filters.rating
                          ) ?? ratingOptions[0]
                        }
                        onChange={(item) =>
                          updateFilter(
                            "rating",
                            item.value === "" ? undefined : item.value
                          )
                        }
                      >
                        {({ open }) => (
                          <div className="relative">
                            <Listbox.Button
                              className={`w-full border-2 rounded-lg px-4 py-3 bg-white text-gray-900 text-sm font-medium shadow-sm outline-none text-left flex items-center justify-between ${
                                open
                                  ? "border-orange-500 ring-2 ring-orange-200"
                                  : "border-gray-300"
                              }`}
                            >
                              <span>
                                {ratingOptions.find(
                                  (r) => r.value === filters.rating
                                )?.label ?? "All Ratings"}
                              </span>
                              <ChevronDownIcon
                                className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                                  open ? "rotate-180" : ""
                                }`}
                              />
                            </Listbox.Button>

                            <Listbox.Options className="absolute z-50 mt-2 w-full max-h-56 overflow-auto rounded-lg bg-white shadow-xl border border-gray-200">
                              {ratingOptions.map((r) => (
                                <Listbox.Option
                                  key={r.label}
                                  value={r}
                                  className={({ active, selected }) =>
                                    `cursor-pointer px-4 py-3 text-sm transition-colors ${
                                      selected
                                        ? "bg-orange-600 text-white font-semibold"
                                        : active
                                        ? "bg-orange-50 text-orange-700"
                                        : "text-gray-900"
                                    }`
                                  }
                                >
                                  {r.label}
                                </Listbox.Option>
                              ))}
                            </Listbox.Options>
                          </div>
                        )}
                      </Listbox>
                    </div>
                  </div>

                  {/* Footer Buttons */}
                  <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
                    <button
                      onClick={() => setFilters({})}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Transition>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <article
              key={activity.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-48">
                <Image
                  src={activity.images[0]}
                  alt={activity.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
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
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
                  <StarIcon className="w-4 h-4 text-yellow-400" />
                  <span className="font-semibold text-sm">
                    {activity.rating}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <MapPinIcon className="w-4 h-4" />
                  <span className="text-sm">{activity.location}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {activity.name}
                </h3>

                <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                  {activity.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ClockIcon className="w-4 h-4" />
                    {activity.duration}
                  </div>
                  <div className="flex items-center gap-1 text-lg font-bold text-orange-600">
                    <span className="text-base">₹</span>
                    {activity.price.min === activity.price.max
                      ? activity.price.min
                      : `${activity.price.min} - ${activity.price.max}`}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-xs text-gray-600 mb-2">Includes:</div>
                  <div className="flex flex-wrap gap-1">
                    {activity.includes.slice(0, 2).map((item, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-xs px-2 py-1 rounded-full"
                      >
                        {item}
                      </span>
                    ))}
                    {activity.includes.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{activity.includes.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  href={`/activities/${activity.slug}`}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2.5 px-4 rounded-lg font-semibold transition-colors duration-200 text-center block"
                >
                  Book Activity
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div ref={loaderRef} className="h-10" />
        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-500">Loading more activities...</p>
          </div>
        )}

        {/* No Results */}
        {filteredActivities.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              No activities found
            </h3>
            <p className="text-gray-600 mb-8">
              Try adjusting your filters to see more results
            </p>
            <button
              onClick={() => setFilters({})}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

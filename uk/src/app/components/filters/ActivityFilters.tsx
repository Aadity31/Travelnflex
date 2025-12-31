// components/ActivityFilters.tsx
"use client";

import { useState, useEffect } from "react";
import {
  XMarkIcon,
  CheckIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import type { SearchFilters, Activity } from "@/app/types";

const activityTypes = [
  { value: "adventure" as const, label: "Adventure" },
  { value: "spiritual" as const, label: "Spiritual" },
  { value: "cultural" as const, label: "Cultural" },
  { value: "trekking" as const, label: "Trekking" },
  { value: "food" as const, label: "Food" },
];

const difficultyLevels = [
  { value: "easy" as const, label: "Easy" },
  { value: "moderate" as const, label: "Moderate" },
  { value: "difficult" as const, label: "Difficult" },
];

const ratingOptions = [
  { value: 4.5, label: "4.5+ Stars" },
  { value: 4.0, label: "4.0+ Stars" },
  { value: 3.5, label: "3.5+ Stars" },
  { value: 3.0, label: "3.0+ Stars" },
];

interface ActivityFiltersProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  filteredCount: number;
}

export default function ActivityFilters({
  filters,
  onFilterChange,
  filteredCount,
}: ActivityFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    activityType: true,
    difficulty: true,
    rating: true,
    location: true,
  });

  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const fullText = "Search location...";

  useEffect(() => {
    if (isFocused) return;

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < fullText.length) {
            setDisplayText(fullText.slice(0, displayText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(fullText.slice(0, displayText.length - 1));
          } else {
            setTimeout(() => setIsDeleting(false), 500);
          }
        }
      },
      isDeleting ? 40 : 120
    );

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, isFocused]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Check if "All" is selected
  const isAllActivityTypesSelected =
    !filters.activityTypes || filters.activityTypes.length === 0;
  const isAllDifficultiesSelected =
    !filters.difficulties || filters.difficulties.length === 0;
  const isAllRatingsSelected = !filters.ratings || filters.ratings.length === 0;

  // ACTIVITY TYPE - MULTIPLE SELECTION WITH ALL
  const handleActivityTypeToggle = (value: Activity["type"] | "all") => {
    if (value === "all") {
      // All select kiya toh sab clear karo
      onFilterChange({
        ...filters,
        activityTypes: undefined,
      });
      return;
    }

    // Agar All selected hai (koi filter nahi), toh directly us value ko add karo
    if (isAllActivityTypesSelected) {
      onFilterChange({
        ...filters,
        activityTypes: [value],
      });
      return;
    }

    // Normal toggle logic
    const currentTypes = filters.activityTypes || [];
    const newTypes = currentTypes.includes(value)
      ? currentTypes.filter((t) => t !== value)
      : [...currentTypes, value];

    onFilterChange({
      ...filters,
      activityTypes: newTypes.length > 0 ? newTypes : undefined,
    });
  };

  // DIFFICULTY - MULTIPLE SELECTION WITH ALL
  const handleDifficultyToggle = (value: Activity["difficulty"] | "all") => {
    if (value === "all") {
      // All select kiya toh sab clear karo
      onFilterChange({
        ...filters,
        difficulties: undefined,
      });
      return;
    }

    // Agar All selected hai (koi filter nahi), toh directly us value ko add karo
    if (isAllDifficultiesSelected) {
      onFilterChange({
        ...filters,
        difficulties: [value],
      });
      return;
    }

    // Normal toggle logic
    const currentDifficulties = filters.difficulties || [];
    const newDifficulties = currentDifficulties.includes(value)
      ? currentDifficulties.filter((d) => d !== value)
      : [...currentDifficulties, value];

    onFilterChange({
      ...filters,
      difficulties: newDifficulties.length > 0 ? newDifficulties : undefined,
    });
  };

  // RATING - MULTIPLE SELECTION WITH ALL
  const handleRatingToggle = (value: number | "all") => {
    if (value === "all") {
      // All select kiya toh sab clear karo
      onFilterChange({
        ...filters,
        ratings: undefined,
      });
      return;
    }

    // Agar All selected hai (koi filter nahi), toh directly us value ko add karo
    if (isAllRatingsSelected) {
      onFilterChange({
        ...filters,
        ratings: [value],
      });
      return;
    }

    // Normal toggle logic
    const currentRatings = filters.ratings || [];
    const newRatings = currentRatings.includes(value)
      ? currentRatings.filter((r) => r !== value)
      : [...currentRatings, value];

    onFilterChange({
      ...filters,
      ratings: newRatings.length > 0 ? newRatings : undefined,
    });
  };

  const activeFiltersCount =
    (filters.activityTypes?.length || 0) +
    (filters.difficulties?.length || 0) +
    (filters.ratings?.length || 0) +
    (filters.location ? 1 : 0);

  return (
    <aside className="w-full lg:w-80 bg-white rounded-xl shadow-md h-fit sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto scrollbar-hide">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Filters</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {filteredCount} activities
            </p>
          </div>
          {activeFiltersCount > 0 && (
            <button
              onClick={() => onFilterChange({})}
              className="text-sm text-orange-600 hover:text-orange-700 font-semibold"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Active Filters Tags */}
        {activeFiltersCount > 0 && (
          <div className="mb-4 pb-3 border-b border-gray-200">
            <div className="flex flex-wrap gap-1.5">
              {filters.activityTypes?.map((type) => (
                <span
                  key={type}
                  className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
                >
                  {activityTypes.find((t) => t.value === type)?.label}
                  <button
                    onClick={() => handleActivityTypeToggle(type)}
                    className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {filters.difficulties?.map((diff) => (
                <span
                  key={diff}
                  className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
                >
                  {difficultyLevels.find((d) => d.value === diff)?.label}
                  <button
                    onClick={() => handleDifficultyToggle(diff)}
                    className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {filters.ratings?.map((rating) => (
                <span
                  key={rating}
                  className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap"
                >
                  {ratingOptions.find((r) => r.value === rating)?.label}
                  <button
                    onClick={() => handleRatingToggle(rating)}
                    className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {filters.location && (
                <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">
                  {filters.location}
                  <button
                    onClick={() =>
                      onFilterChange({ ...filters, location: undefined })
                    }
                    className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Location Search - WITH ICON, NO HEADING */}
        <div className="mb-5">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none z-10" />
            <input
              type="text"
              value={filters.location || ""}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
                if (!filters.location) {
                  setDisplayText("");
                  setIsDeleting(false);
                }
              }}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  location: e.target.value || undefined,
                })
              }
              className="w-full border-2 border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-lg pl-9 pr-3 py-2 bg-white text-gray-900 text-sm transition-all outline-none"
            />
            {!filters.location && !isFocused && (
              <div className="absolute left-9 top-2 text-gray-400 text-sm pointer-events-none select-none">
                <span className="inline-flex items-center">
                  {displayText}
                  <span className="inline-block w-0.5 h-4 bg-orange-500 ml-0.5 animate-blink"></span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Activity Type Filter */}
        <div className="mb-5">
          <button
            onClick={() => toggleSection("activityType")}
            className="w-full flex items-center justify-between text-sm font-semibold text-gray-900 mb-3"
          >
            <span>
              Activity Type
              {filters.activityTypes && filters.activityTypes.length > 0 && (
                <span className="ml-2 text-xs bg-orange-600 text-white rounded-full px-2 py-0.5">
                  {filters.activityTypes.length}
                </span>
              )}
            </span>
            <span className="text-gray-400">
              {expandedSections.activityType ? "−" : "+"}
            </span>
          </button>
          {expandedSections.activityType && (
            <div className="space-y-2">
              {/* ALL OPTION */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={isAllActivityTypesSelected}
                    onChange={() => handleActivityTypeToggle("all")}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-orange-600 peer-checked:border-orange-600 flex items-center justify-center transition-all group-hover:border-orange-400">
                    {isAllActivityTypesSelected && (
                      <CheckIcon className="w-3.5 h-3.5 text-white" />
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                  All Activities
                </span>
              </label>

              {/* INDIVIDUAL OPTIONS */}
              {activityTypes.map((type) => {
                const isSelected =
                  !isAllActivityTypesSelected &&
                  filters.activityTypes?.includes(type.value);

                return (
                  <label
                    key={type.value}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={isSelected || false}
                        onChange={() => handleActivityTypeToggle(type.value)}
                        className="peer sr-only"
                      />
                      <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-orange-600 peer-checked:border-orange-600 flex items-center justify-center transition-all group-hover:border-orange-400">
                        {isSelected && (
                          <CheckIcon className="w-3.5 h-3.5 text-white" />
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      {type.label}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Difficulty Level Filter */}
        <div className="mb-5">
          <button
            onClick={() => toggleSection("difficulty")}
            className="w-full flex items-center justify-between text-sm font-semibold text-gray-900 mb-3"
          >
            <span>
              Difficulty Level
              {filters.difficulties && filters.difficulties.length > 0 && (
                <span className="ml-2 text-xs bg-orange-600 text-white rounded-full px-2 py-0.5">
                  {filters.difficulties.length}
                </span>
              )}
            </span>
            <span className="text-gray-400">
              {expandedSections.difficulty ? "−" : "+"}
            </span>
          </button>
          {expandedSections.difficulty && (
            <div className="space-y-2">
              {/* ALL OPTION */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={isAllDifficultiesSelected}
                    onChange={() => handleDifficultyToggle("all")}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-orange-600 peer-checked:border-orange-600 flex items-center justify-center transition-all group-hover:border-orange-400">
                    {isAllDifficultiesSelected && (
                      <CheckIcon className="w-3.5 h-3.5 text-white" />
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                  All Levels
                </span>
              </label>

              {/* INDIVIDUAL OPTIONS */}
              {difficultyLevels.map((level) => {
                const isSelected =
                  !isAllDifficultiesSelected &&
                  filters.difficulties?.includes(level.value);

                return (
                  <label
                    key={level.value}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={isSelected || false}
                        onChange={() => handleDifficultyToggle(level.value)}
                        className="peer sr-only"
                      />
                      <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-orange-600 peer-checked:border-orange-600 flex items-center justify-center transition-all group-hover:border-orange-400">
                        {isSelected && (
                          <CheckIcon className="w-3.5 h-3.5 text-white" />
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      {level.label}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Rating Filter */}
        <div className="mb-5">
          <button
            onClick={() => toggleSection("rating")}
            className="w-full flex items-center justify-between text-sm font-semibold text-gray-900 mb-3"
          >
            <span>
              Minimum Rating
              {filters.ratings && filters.ratings.length > 0 && (
                <span className="ml-2 text-xs bg-orange-600 text-white rounded-full px-2 py-0.5">
                  {filters.ratings.length}
                </span>
              )}
            </span>
            <span className="text-gray-400">
              {expandedSections.rating ? "−" : "+"}
            </span>
          </button>
          {expandedSections.rating && (
            <div className="space-y-2">
              {/* ALL OPTION */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={isAllRatingsSelected}
                    onChange={() => handleRatingToggle("all")}
                    className="peer sr-only"
                  />
                  <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-orange-600 peer-checked:border-orange-600 flex items-center justify-center transition-all group-hover:border-orange-400">
                    {isAllRatingsSelected && (
                      <CheckIcon className="w-3.5 h-3.5 text-white" />
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                  All Ratings
                </span>
              </label>

              {/* INDIVIDUAL OPTIONS */}
              {ratingOptions.map((rating) => {
                const isSelected =
                  !isAllRatingsSelected &&
                  filters.ratings?.includes(rating.value);

                return (
                  <label
                    key={rating.label}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={isSelected || false}
                        onChange={() => handleRatingToggle(rating.value)}
                        className="peer sr-only"
                      />
                      <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-orange-600 peer-checked:border-orange-600 flex items-center justify-center transition-all group-hover:border-orange-400">
                        {isSelected && (
                          <CheckIcon className="w-3.5 h-3.5 text-white" />
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      {rating.label}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

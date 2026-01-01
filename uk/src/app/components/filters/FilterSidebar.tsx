"use client";

import { useState, useEffect } from "react";
import {
  XMarkIcon,
  CheckIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import type { SearchFilters, Activity } from "@/app/types";

// --- CONSTANTS ---
const activityTypes = [
  { value: "adventure", label: "Adventure" },
  { value: "spiritual", label: "Spiritual" },
  { value: "cultural", label: "Cultural" },
  { value: "trekking", label: "Trekking" },
  { value: "food", label: "Food" },
];

const difficultyLevels = [
  { value: "easy", label: "Easy" },
  { value: "moderate", label: "Moderate" },
  { value: "difficult", label: "Difficult" },
];

const ratingOptions = [
  { value: 4.5, label: "4.5+ Stars" },
  { value: 4.0, label: "4.0+ Stars" },
  { value: 3.5, label: "3.5+ Stars" },
  { value: 3.0, label: "3.0+ Stars" },
];

const priceRanges = [
  { label: "₹0 - ₹2500", min: 0, max: 2500 },
  { label: "₹2500 - ₹6000", min: 2500, max: 6000 },
  { label: "₹6000 - ₹9000", min: 6000, max: 9000 },
  { label: "₹9000 - ₹12000", min: 9000, max: 12000 },
  { label: "₹12000 - ₹15000", min: 12000, max: 15000 },
  { label: "₹15000 - ₹30000", min: 15000, max: 30000 },
  { label: "₹30000+", min: 30000, max: 1000000 },
];

// SLIDER CONSTANTS
const MIN_PRICE_LIMIT = 0;
const MAX_PRICE_LIMIT = 50000;

interface FilterSidebarProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  filteredCount: number;
  showActivityTypes?: boolean;
  showDifficulty?: boolean;
  showRating?: boolean;
  showPrice?: boolean;
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  filteredCount,
  showActivityTypes = true,
  showDifficulty = true,
  showRating = true,
  showPrice = true,
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    activityType: true,
    difficulty: true,
    rating: true,
    location: true,
    price: true,
  });

  const [sliderMin, setSliderMin] = useState(MIN_PRICE_LIMIT);
  const [sliderMax, setSliderMax] = useState(MAX_PRICE_LIMIT);
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

  useEffect(() => {
    if (filters.priceRange) {
      setSliderMin(filters.priceRange[0]);
      setSliderMax(
        filters.priceRange[1] > MAX_PRICE_LIMIT
          ? MAX_PRICE_LIMIT
          : filters.priceRange[1]
      );
    } else {
      setSliderMin(MIN_PRICE_LIMIT);
      setSliderMax(MAX_PRICE_LIMIT);
    }
  }, [filters.priceRange]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // --- HANDLERS ---
  const handleActivityTypeToggle = (val: string | "all") => {
    if (val === "all") {
      onFilterChange({ ...filters, activityTypes: undefined });
      return;
    }
    const value = val as Activity["type"];
    if (!filters.activityTypes || filters.activityTypes.length === 0) {
      onFilterChange({ ...filters, activityTypes: [value] });
      return;
    }
    const currentTypes = filters.activityTypes || [];
    const newTypes = currentTypes.includes(value)
      ? currentTypes.filter((t) => t !== value)
      : [...currentTypes, value];
    onFilterChange({
      ...filters,
      activityTypes: newTypes.length > 0 ? newTypes : undefined,
    });
  };

  const handleDifficultyToggle = (val: string | "all") => {
    if (val === "all") {
      onFilterChange({ ...filters, difficulties: undefined });
      return;
    }
    const value = val as Activity["difficulty"];
    if (!filters.difficulties || filters.difficulties.length === 0) {
      onFilterChange({ ...filters, difficulties: [value] });
      return;
    }
    const currentDifficulties = filters.difficulties || [];
    const newDifficulties = currentDifficulties.includes(value)
      ? currentDifficulties.filter((d) => d !== value)
      : [...currentDifficulties, value];
    onFilterChange({
      ...filters,
      difficulties: newDifficulties.length > 0 ? newDifficulties : undefined,
    });
  };

  const handleRatingToggle = (value: number | "all") => {
    if (value === "all") {
      onFilterChange({ ...filters, ratings: undefined });
      return;
    }
    if (!filters.ratings || filters.ratings.length === 0) {
      onFilterChange({ ...filters, ratings: [value] });
      return;
    }
    const currentRatings = filters.ratings || [];
    const newRatings = currentRatings.includes(value)
      ? currentRatings.filter((r) => r !== value)
      : [...currentRatings, value];
    onFilterChange({
      ...filters,
      ratings: newRatings.length > 0 ? newRatings : undefined,
    });
  };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);
    if (value > sliderMax - 100) value = sliderMax - 100;
    if (value < MIN_PRICE_LIMIT) value = MIN_PRICE_LIMIT;
    setSliderMin(value);
    onFilterChange({ ...filters, priceRange: [value, sliderMax] });
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);
    if (value < sliderMin + 100) value = sliderMin + 100;
    if (value > MAX_PRICE_LIMIT) value = MAX_PRICE_LIMIT;
    setSliderMax(value);
    onFilterChange({ ...filters, priceRange: [sliderMin, value] });
  };

  const handlePriceRangeToggle = (range: { min: number; max: number }) => {
    const isSelected =
      filters.priceRange &&
      filters.priceRange[0] === range.min &&
      filters.priceRange[1] === range.max;
    if (isSelected) {
      setSliderMin(MIN_PRICE_LIMIT);
      setSliderMax(MAX_PRICE_LIMIT);
      onFilterChange({ ...filters, priceRange: undefined });
    } else {
      setSliderMin(range.min);
      setSliderMax(range.max > MAX_PRICE_LIMIT ? MAX_PRICE_LIMIT : range.max);
      onFilterChange({ ...filters, priceRange: [range.min, range.max] });
    }
  };

  const activeFiltersCount =
    (filters.activityTypes?.length || 0) +
    (filters.difficulties?.length || 0) +
    (filters.ratings?.length || 0) +
    (filters.location ? 1 : 0) +
    (filters.priceRange ? 1 : 0);

  return (
    <aside className="w-full md:w-72 lg:w-64 xl:w-72 2xl:w-80 bg-white rounded-xl shadow-md h-fit sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto scrollbar-hide">
      <div className="p-4 lg:p-4 xl:p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
          <div>
            <h2 className="text-sm lg:text-base 2xl:text-lg font-bold text-gray-900">
              Filters
            </h2>
            <p className="text-[10px] lg:text-xs 2xl:text-sm text-gray-500 mt-0.5">
              {filteredCount} results
            </p>
          </div>
          {activeFiltersCount > 0 && (
            <button
              onClick={() => {
                onFilterChange({});
                setSliderMin(MIN_PRICE_LIMIT);
                setSliderMax(MAX_PRICE_LIMIT);
              }}
              className="text-xs 2xl:text-sm text-orange-600 hover:text-orange-700 font-semibold"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Active Tags */}
        {activeFiltersCount > 0 && (
          <div className="mb-4 pb-2 border-b border-gray-200">
            <div className="flex flex-wrap gap-1">
              {filters.activityTypes?.map((type) => (
                <span
                  key={type}
                  className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full text-[10px] 2xl:text-xs font-medium whitespace-nowrap"
                >
                  {activityTypes.find((t) => t.value === type)?.label}
                  <button
                    onClick={() => handleActivityTypeToggle(type)}
                    className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                  >
                    <XMarkIcon className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
              {filters.difficulties?.map((diff) => (
                <span
                  key={diff}
                  className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full text-[10px] 2xl:text-xs font-medium whitespace-nowrap"
                >
                  {difficultyLevels.find((d) => d.value === diff)?.label}
                  <button
                    onClick={() => handleDifficultyToggle(diff)}
                    className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                  >
                    <XMarkIcon className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
              {filters.ratings?.map((rating) => (
                <span
                  key={rating}
                  className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full text-[10px] 2xl:text-xs font-medium whitespace-nowrap"
                >
                  {ratingOptions.find((r) => r.value === rating)?.label}
                  <button
                    onClick={() => handleRatingToggle(rating)}
                    className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                  >
                    <XMarkIcon className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
              {filters.priceRange && (
                <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full text-[10px] 2xl:text-xs font-medium whitespace-nowrap">
                  ₹{filters.priceRange[0]} -{" "}
                  {filters.priceRange[1] >= 1000000
                    ? "30000+"
                    : `₹${filters.priceRange[1]}`}
                  <button
                    onClick={() => {
                      onFilterChange({ ...filters, priceRange: undefined });
                      setSliderMin(MIN_PRICE_LIMIT);
                      setSliderMax(MAX_PRICE_LIMIT);
                    }}
                    className="hover:bg-orange-200 rounded-full p-0.5 transition-colors"
                  >
                    <XMarkIcon className="w-2.5 h-2.5" />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Location Search */}
        <div className="mb-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-3.5 h-3.5 2xl:w-4 2xl:h-4 2xl:top-3 text-gray-400 pointer-events-none z-10" />
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
              className="w-full border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-200 rounded-md pl-8 pr-3 py-1.5 2xl:py-2 text-xs 2xl:text-sm text-gray-900 transition-all outline-none"
            />
            {!filters.location && !isFocused && (
              <div className="absolute left-8 top-2 2xl:top-2.5 text-gray-400 text-xs 2xl:text-sm pointer-events-none select-none">
                <span className="inline-flex items-center">
                  {displayText}
                  <span className="inline-block w-0.5 h-3 2xl:h-4 bg-orange-500 ml-0.5 animate-blink"></span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 1. Price Range Filter */}
        {showPrice && (
          <div className="mb-4 border-b border-gray-100 pb-4">
            <button
              onClick={() => toggleSection("price")}
              className="w-full flex items-center justify-between text-xs 2xl:text-base font-semibold text-gray-900 mb-2"
            >
              <span>Price Range</span>
              <span className="text-gray-400">
                {expandedSections.price ? "−" : "+"}
              </span>
            </button>
            {expandedSections.price && (
              <div className="space-y-3">
                {/* Checkbox Options */}
                <div className="space-y-1.5 2xl:space-y-2">
                  {priceRanges.map((range, idx) => {
                    const isSelected =
                      filters.priceRange &&
                      filters.priceRange[0] === range.min &&
                      filters.priceRange[1] === range.max;
                    return (
                      <label
                        key={idx}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            checked={!!isSelected}
                            onChange={() => handlePriceRangeToggle(range)}
                            className="peer sr-only"
                          />
                          <div className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 border border-gray-300 rounded peer-checked:bg-orange-600 peer-checked:border-orange-600 flex items-center justify-center transition-all group-hover:border-orange-400">
                            {isSelected && (
                              <CheckIcon className="w-2.5 h-2.5 text-white" />
                            )}
                          </div>
                        </div>
                        <span className="text-[11px] 2xl:text-sm text-gray-700 group-hover:text-gray-900">
                          {range.label}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {/* Dual Range Slider */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] 2xl:text-xs font-semibold text-gray-700">
                        Min
                      </span>
                      <input
                        type="number"
                        value={sliderMin}
                        onChange={handleMinChange}
                        className="w-16 2xl:w-20 border border-gray-300 bg-white rounded py-1 px-1 text-xs 2xl:text-sm text-center text-gray-900 focus:border-orange-500 outline-none"
                      />
                    </div>
                    <span className="text-gray-400 font-bold">-</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] 2xl:text-xs font-semibold text-gray-700">
                        Max
                      </span>
                      <input
                        type="number"
                        value={sliderMax}
                        onChange={handleMaxChange}
                        className="w-16 2xl:w-20 border border-gray-300 bg-white rounded py-1 px-1 text-xs 2xl:text-sm text-center text-gray-900 focus:border-orange-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="relative w-full h-4 2xl:h-5 flex items-center justify-center">
                    <div className="absolute w-full h-1 bg-gray-200 rounded-full"></div>
                    <div
                      className="absolute h-1 bg-orange-500 rounded-full"
                      style={{
                        left: `${(sliderMin / MAX_PRICE_LIMIT) * 100}%`,
                        right: `${100 - (sliderMax / MAX_PRICE_LIMIT) * 100}%`,
                      }}
                    ></div>
                    <input
                      type="range"
                      min={MIN_PRICE_LIMIT}
                      max={MAX_PRICE_LIMIT}
                      value={sliderMin}
                      onChange={handleMinChange}
                      className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none z-10 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 2xl:[&::-webkit-slider-thumb]:w-4 2xl:[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-grab"
                    />
                    <input
                      type="range"
                      min={MIN_PRICE_LIMIT}
                      max={MAX_PRICE_LIMIT}
                      value={sliderMax}
                      onChange={handleMaxChange}
                      className="absolute w-full h-1 bg-transparent appearance-none pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 2xl:[&::-webkit-slider-thumb]:w-4 2xl:[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-grab"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. Activity Type Filter */}
        {showActivityTypes && (
          <div className="mb-4">
            <button
              onClick={() => toggleSection("activityType")}
              className="w-full flex items-center justify-between text-xs 2xl:text-base font-semibold text-gray-900 mb-2"
            >
              <span>
                Activity Type{" "}
                {filters.activityTypes && filters.activityTypes.length > 0 && (
                  <span className="ml-1 text-[10px] bg-orange-600 text-white rounded-full px-1.5 py-0.5">
                    {filters.activityTypes.length}
                  </span>
                )}
              </span>
              <span className="text-gray-400">
                {expandedSections.activityType ? "−" : "+"}
              </span>
            </button>
            {expandedSections.activityType && (
              <div className="space-y-1.5 2xl:space-y-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={!filters.activityTypes?.length}
                      onChange={() => handleActivityTypeToggle("all")}
                      className="peer sr-only"
                    />
                    <div className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 border border-gray-300 rounded peer-checked:bg-orange-600 peer-checked:border-orange-600 flex items-center justify-center transition-all group-hover:border-orange-400">
                      {!filters.activityTypes?.length && (
                        <CheckIcon className="w-2.5 h-2.5 text-white" />
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] 2xl:text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                    All Types
                  </span>
                </label>
                {activityTypes.map((type) => {
                  const isSelected = filters.activityTypes?.includes(
                    type.value as Activity["type"]
                  );
                  return (
                    <label
                      key={type.value}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={isSelected || false}
                          onChange={() => handleActivityTypeToggle(type.value)}
                          className="peer sr-only"
                        />
                        <div className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 border border-gray-300 rounded peer-checked:bg-orange-600 peer-checked:border-orange-600 flex items-center justify-center transition-all group-hover:border-orange-400">
                          {isSelected && (
                            <CheckIcon className="w-2.5 h-2.5 text-white" />
                          )}
                        </div>
                      </div>
                      <span className="text-[11px] 2xl:text-sm text-gray-700 group-hover:text-gray-900">
                        {type.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 3. Difficulty Filter */}
        {showDifficulty && (
          <div className="mb-4">
            <button
              onClick={() => toggleSection("difficulty")}
              className="w-full flex items-center justify-between text-xs 2xl:text-base font-semibold text-gray-900 mb-2"
            >
              <span>
                Difficulty Level{" "}
                {filters.difficulties && filters.difficulties.length > 0 && (
                  <span className="ml-1 text-[10px] bg-orange-600 text-white rounded-full px-1.5 py-0.5">
                    {filters.difficulties.length}
                  </span>
                )}
              </span>
              <span className="text-gray-400">
                {expandedSections.difficulty ? "−" : "+"}
              </span>
            </button>
            {expandedSections.difficulty && (
              <div className="space-y-1.5 2xl:space-y-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={!filters.difficulties?.length}
                      onChange={() => handleDifficultyToggle("all")}
                      className="peer sr-only"
                    />
                    <div className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 border border-gray-300 rounded peer-checked:bg-orange-600 peer-checked:border-orange-600 flex items-center justify-center transition-all group-hover:border-orange-400">
                      {!filters.difficulties?.length && (
                        <CheckIcon className="w-2.5 h-2.5 text-white" />
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] 2xl:text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                    All Levels
                  </span>
                </label>
                {difficultyLevels.map((level) => {
                  const isSelected = filters.difficulties?.includes(
                    level.value as Activity["difficulty"]
                  );
                  return (
                    <label
                      key={level.value}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={isSelected || false}
                          onChange={() => handleDifficultyToggle(level.value)}
                          className="peer sr-only"
                        />
                        <div className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 border border-gray-300 rounded peer-checked:bg-orange-600 peer-checked:border-orange-600 flex items-center justify-center transition-all group-hover:border-orange-400">
                          {isSelected && (
                            <CheckIcon className="w-2.5 h-2.5 text-white" />
                          )}
                        </div>
                      </div>
                      <span className="text-[11px] 2xl:text-sm text-gray-700 group-hover:text-gray-900">
                        {level.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 4. Rating Filter */}
        {showRating && (
          <div className="mb-4">
            <button
              onClick={() => toggleSection("rating")}
              className="w-full flex items-center justify-between text-xs 2xl:text-base font-semibold text-gray-900 mb-2"
            >
              <span>
                Minimum Rating{" "}
                {filters.ratings && filters.ratings.length > 0 && (
                  <span className="ml-1 text-[10px] bg-orange-600 text-white rounded-full px-1.5 py-0.5">
                    {filters.ratings.length}
                  </span>
                )}
              </span>
              <span className="text-gray-400">
                {expandedSections.rating ? "−" : "+"}
              </span>
            </button>
            {expandedSections.rating && (
              <div className="space-y-1.5 2xl:space-y-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={!filters.ratings?.length}
                      onChange={() => handleRatingToggle("all")}
                      className="peer sr-only"
                    />
                    <div className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 border border-gray-300 rounded peer-checked:bg-orange-600 peer-checked:border-orange-600 flex items-center justify-center transition-all group-hover:border-orange-400">
                      {!filters.ratings?.length && (
                        <CheckIcon className="w-2.5 h-2.5 text-white" />
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] 2xl:text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                    All Ratings
                  </span>
                </label>
                {ratingOptions.map((rating) => {
                  const isSelected = filters.ratings?.includes(rating.value);
                  return (
                    <label
                      key={rating.label}
                      className="flex items-center gap-2 cursor-pointer group"
                    >
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          checked={isSelected || false}
                          onChange={() => handleRatingToggle(rating.value)}
                          className="peer sr-only"
                        />
                        <div className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 border border-gray-300 rounded peer-checked:bg-orange-600 peer-checked:border-orange-600 flex items-center justify-center transition-all group-hover:border-orange-400">
                          {isSelected && (
                            <CheckIcon className="w-2.5 h-2.5 text-white" />
                          )}
                        </div>
                      </div>
                      <span className="text-[11px] 2xl:text-sm text-gray-700 group-hover:text-gray-900">
                        {rating.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

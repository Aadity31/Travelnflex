"use client";

import { Fragment, useState, useEffect } from "react";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/solid";
import { Transition, TransitionChild } from "@headlessui/react";
import type { SearchFilters, Activity } from "@/app/types";

// --- CONSTANTS ---
const activityTypes = [
  { value: "adventure", label: "Adventure" },
  { value: "spiritual", label: "Spiritual" },
  { value: "cultural", label: "Cultural" },
  { value: "trekking", label: "Trekking" },
  { value: "food", label: "Food" },
] as const;

const difficultyLevels = [
  { value: "easy", label: "Easy" },
  { value: "moderate", label: "Moderate" },
  { value: "difficult", label: "Difficult" },
] as const;

const ratingOptions = [
  { value: 4.5, label: "4.5+ Stars" },
  { value: 4.0, label: "4.0+ Stars" },
  { value: 3.5, label: "3.5+ Stars" },
  { value: 3.0, label: "3.0+ Stars" },
] as const;

// Price Ranges
const priceRanges = [
  { label: "₹0 - ₹2500", min: 0, max: 2500 },
  { label: "₹2500 - ₹6000", min: 2500, max: 6000 },
  { label: "₹6000 - ₹9000", min: 6000, max: 9000 },
  { label: "₹9000 - ₹12000", min: 9000, max: 12000 },
  { label: "₹12000 - ₹15000", min: 12000, max: 15000 },
  { label: "₹15000 - ₹30000", min: 15000, max: 30000 },
  { label: "₹30000+", min: 30000, max: 1000000 },
];

const MIN_PRICE_LIMIT = 0;
const MAX_PRICE_LIMIT = 50000;

interface MobileFilterSidebarProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  isOpen: boolean;
  onClose: () => void;
  showActivityTypes?: boolean;
  showDifficulty?: boolean;
  showRating?: boolean;
  showPrice?: boolean;
}

export default function MobileFilterSidebar({
  filters,
  onFilterChange,
  isOpen,
  onClose,
  showActivityTypes = true,
  showDifficulty = true,
  showRating = true,
  showPrice = true,
}: MobileFilterSidebarProps) {
  // Slider State
  const [sliderMin, setSliderMin] = useState(MIN_PRICE_LIMIT);
  const [sliderMax, setSliderMax] = useState(MAX_PRICE_LIMIT);

  // Sync state with parent filters
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

  // --- HANDLERS ---
  const handleActivityTypeToggle = (val: string) => {
    const value = val as Activity["type"];
    const currentTypes = filters.activityTypes || [];
    const newTypes = currentTypes.includes(value)
      ? currentTypes.filter((t) => t !== value)
      : [...currentTypes, value];
    onFilterChange({
      ...filters,
      activityTypes: newTypes.length > 0 ? newTypes : undefined,
    });
  };

  const handleDifficultyToggle = (val: string) => {
    const value = val as Activity["difficulty"];
    const currentDifficulties = filters.difficulties || [];
    const newDifficulties = currentDifficulties.includes(value)
      ? currentDifficulties.filter((d) => d !== value)
      : [...currentDifficulties, value];
    onFilterChange({
      ...filters,
      difficulties: newDifficulties.length > 0 ? newDifficulties : undefined,
    });
  };

  const handleRatingToggle = (value: number) => {
    const currentRatings = filters.ratings || [];
    const newRatings = currentRatings.includes(value)
      ? currentRatings.filter((r) => r !== value)
      : [...currentRatings, value];
    onFilterChange({
      ...filters,
      ratings: newRatings.length > 0 ? newRatings : undefined,
    });
  };

  // Slider Logic (Updated for direct apply & validation)
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

  const activeCount =
    (filters.activityTypes?.length || 0) +
    (filters.difficulties?.length || 0) +
    (filters.ratings?.length || 0) +
    (filters.location ? 1 : 0) +
    (filters.priceRange ? 1 : 0);

  return (
    <Transition show={isOpen} as={Fragment}>
      <div className="fixed inset-0 z-50 lg:hidden">
        {/* Backdrop */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        </TransitionChild>

        {/* Drawer */}
        <TransitionChild
          as={Fragment}
          enter="transform transition ease-out duration-300"
          enterFrom="translate-y-full"
          enterTo="translate-y-0"
          leave="transform transition ease-in duration-200"
          leaveFrom="translate-y-0"
          leaveTo="translate-y-full"
        >
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between rounded-t-3xl z-10 flex-shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                {activeCount > 0 && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {activeCount} filters applied
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            

            {/* Scrollable Content */}
            <div className="p-5 space-y-6 overflow-y-auto flex-1">
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
                    onFilterChange({
                      ...filters,
                      location: e.target.value || undefined,
                    })
                  }
                  className="w-full border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-200 rounded-md px-4 py-2 bg-white text-gray-900 text-sm transition-all outline-none"
                />
              </div>

              {/* Price Range (Updated) */}
              {showPrice && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Price Range
                  </label>

                  {/* Checkboxes */}
                  <div className="space-y-3 mb-5">
                    {priceRanges.map((range, idx) => {
                      const isSelected =
                        filters.priceRange &&
                        filters.priceRange[0] === range.min &&
                        filters.priceRange[1] === range.max;
                      return (
                        <label
                          key={idx}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <div className="relative flex items-center">
                            <input
                              type="checkbox"
                              checked={!!isSelected}
                              onChange={() => handlePriceRangeToggle(range)}
                              className="peer sr-only"
                            />
                            <div className="w-5 h-5 border border-gray-300 rounded peer-checked:bg-orange-600 peer-checked:border-orange-600 flex items-center justify-center transition-all">
                              {isSelected && (
                                <CheckIcon className="w-3.5 h-3.5 text-white" />
                              )}
                            </div>
                          </div>
                          <span className="text-sm text-gray-700 font-medium">
                            {range.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  {/* Slider with Inputs */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">Min</span>
                        <input
                          type="number"
                          value={sliderMin}
                          onChange={handleMinChange}
                          className="w-20 border border-gray-300 rounded py-1 px-2 text-sm text-center focus:border-orange-500 outline-none"
                        />
                      </div>
                      <span className="text-gray-400">-</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">Max</span>
                        <input
                          type="number"
                          value={sliderMax}
                          onChange={handleMaxChange}
                          className="w-20 border border-gray-300 rounded py-1 px-2 text-sm text-center focus:border-orange-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="relative w-full h-6 flex items-center justify-center">
                      <div className="absolute w-full h-1.5 bg-gray-200 rounded-full"></div>
                      <div
                        className="absolute h-1.5 bg-orange-500 rounded-full"
                        style={{
                          left: `${(sliderMin / MAX_PRICE_LIMIT) * 100}%`,
                          right: `${
                            100 - (sliderMax / MAX_PRICE_LIMIT) * 100
                          }%`,
                        }}
                      ></div>
                      <input
                        type="range"
                        min={MIN_PRICE_LIMIT}
                        max={MAX_PRICE_LIMIT}
                        value={sliderMin}
                        onChange={handleMinChange}
                        className="absolute w-full h-1.5 bg-transparent appearance-none pointer-events-none z-10 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-grab"
                      />
                      <input
                        type="range"
                        min={MIN_PRICE_LIMIT}
                        max={MAX_PRICE_LIMIT}
                        value={sliderMax}
                        onChange={handleMaxChange}
                        className="absolute w-full h-1.5 bg-transparent appearance-none pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-grab"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Activity Types (Full Logic) */}
              {showActivityTypes && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Activity Type
                  </label>
                  <div className="space-y-3">
                    {activityTypes.map((type) => {
                      const isSelected = filters.activityTypes?.includes(
                        type.value as Activity["type"]
                      );
                      return (
                        <label
                          key={type.value}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <div className="relative flex items-center">
                            <input
                              type="checkbox"
                              checked={isSelected || false}
                              onChange={() =>
                                handleActivityTypeToggle(type.value)
                              }
                              className="peer sr-only"
                            />
                            <div className="w-5 h-5 border border-gray-300 rounded peer-checked:bg-orange-600 peer-checked:border-orange-600 flex items-center justify-center transition-all">
                              {isSelected && (
                                <CheckIcon className="w-3.5 h-3.5 text-white" />
                              )}
                            </div>
                          </div>
                          <span className="text-sm text-gray-700 font-medium">
                            {type.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Difficulty (Full Logic) */}
              {showDifficulty && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Difficulty Level
                  </label>
                  <div className="space-y-3">
                    {difficultyLevels.map((level) => {
                      const isSelected = filters.difficulties?.includes(
                        level.value as Activity["difficulty"]
                      );
                      return (
                        <label
                          key={level.value}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <div className="relative flex items-center">
                            <input
                              type="checkbox"
                              checked={isSelected || false}
                              onChange={() =>
                                handleDifficultyToggle(level.value)
                              }
                              className="peer sr-only"
                            />
                            <div className="w-5 h-5 border border-gray-300 rounded peer-checked:bg-orange-600 peer-checked:border-orange-600 flex items-center justify-center transition-all">
                              {isSelected && (
                                <CheckIcon className="w-3.5 h-3.5 text-white" />
                              )}
                            </div>
                          </div>
                          <span className="text-sm text-gray-700 font-medium">
                            {level.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Rating (Full Logic) */}
              {showRating && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Minimum Rating
                  </label>
                  <div className="space-y-3">
                    {ratingOptions.map((rating) => {
                      const isSelected = filters.ratings?.includes(
                        rating.value
                      );
                      return (
                        <label
                          key={rating.label}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <div className="relative flex items-center">
                            <input
                              type="checkbox"
                              checked={isSelected || false}
                              onChange={() => handleRatingToggle(rating.value)}
                              className="peer sr-only"
                            />
                            <div className="w-5 h-5 border border-gray-300 rounded peer-checked:bg-orange-600 peer-checked:border-orange-600 flex items-center justify-center transition-all">
                              {isSelected && (
                                <CheckIcon className="w-3.5 h-3.5 text-white" />
                              )}
                            </div>
                          </div>
                          <span className="text-sm text-gray-700 font-medium">
                            {rating.label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3 flex-shrink-0 safe-area-bottom">
              <button
                onClick={() => {
                  onFilterChange({});
                  setSliderMin(MIN_PRICE_LIMIT);
                  setSliderMax(MAX_PRICE_LIMIT);
                }}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md"
              >
                See Results
              </button>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Transition>
  );
}

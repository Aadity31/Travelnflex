// components/MobileActivityFilters.tsx
"use client";

import { Fragment } from "react";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/solid";
import { Transition, TransitionChild } from "@headlessui/react";
import type { SearchFilters, Activity } from "@/app/types";

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

interface MobileActivityFiltersProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileActivityFilters({
  filters,
  onFilterChange,
  isOpen,
  onClose,
}: MobileActivityFiltersProps) {
  // ACTIVITY TYPE - MULTIPLE SELECTION
  const handleActivityTypeToggle = (value: Activity["type"]) => {
    const currentTypes = filters.activityTypes || [];
    const newTypes = currentTypes.includes(value)
      ? currentTypes.filter((t) => t !== value)
      : [...currentTypes, value];

    onFilterChange({
      ...filters,
      activityTypes: newTypes.length > 0 ? newTypes : undefined,
    });
  };

  // DIFFICULTY - MULTIPLE SELECTION
  const handleDifficultyToggle = (value: Activity["difficulty"]) => {
    const currentDifficulties = filters.difficulties || [];
    const newDifficulties = currentDifficulties.includes(value)
      ? currentDifficulties.filter((d) => d !== value)
      : [...currentDifficulties, value];

    onFilterChange({
      ...filters,
      difficulties: newDifficulties.length > 0 ? newDifficulties : undefined,
    });
  };

  // RATING - MULTIPLE SELECTION
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
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between rounded-t-3xl z-10">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Filter Activities
                </h3>
                {(filters.activityTypes?.length || 0) +
                  (filters.difficulties?.length || 0) +
                  (filters.ratings?.length || 0) +
                  (filters.location ? 1 : 0) >
                  0 && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {(filters.activityTypes?.length || 0) +
                      (filters.difficulties?.length || 0) +
                      (filters.ratings?.length || 0) +
                      (filters.location ? 1 : 0)}{" "}
                    filters applied
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

            {/* Filter Options */}
            <div className="p-5 space-y-6">
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
                  className="w-full border-2 border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-lg px-4 py-3 bg-white text-gray-900 text-sm font-medium placeholder:text-gray-500 shadow-sm transition-all outline-none"
                />
              </div>

              {/* Activity Type - MULTIPLE */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Activity Type
                  {filters.activityTypes &&
                    filters.activityTypes.length > 0 && (
                      <span className="ml-2 text-xs bg-orange-600 text-white rounded-full px-2 py-0.5">
                        {filters.activityTypes.length}
                      </span>
                    )}
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
                            checked={isSelected}
                            onChange={() =>
                              handleActivityTypeToggle(
                                type.value as Activity["type"]
                              )
                            }
                            className="peer sr-only"
                          />
                          <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-orange-600 peer-checked:border-orange-600 flex items-center justify-center transition-all">
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

              {/* Difficulty Level - MULTIPLE */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Difficulty Level
                  {filters.difficulties && filters.difficulties.length > 0 && (
                    <span className="ml-2 text-xs bg-orange-600 text-white rounded-full px-2 py-0.5">
                      {filters.difficulties.length}
                    </span>
                  )}
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
                            checked={isSelected}
                            onChange={() =>
                              handleDifficultyToggle(
                                level.value as Activity["difficulty"]
                              )
                            }
                            className="peer sr-only"
                          />
                          <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-orange-600 peer-checked:border-orange-600 flex items-center justify-center transition-all">
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

              {/* Rating - MULTIPLE */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Minimum Rating
                  {filters.ratings && filters.ratings.length > 0 && (
                    <span className="ml-2 text-xs bg-orange-600 text-white rounded-full px-2 py-0.5">
                      {filters.ratings.length}
                    </span>
                  )}
                </label>
                <div className="space-y-3">
                  {ratingOptions.map((rating) => {
                    const isSelected = filters.ratings?.includes(rating.value);

                    return (
                      <label
                        key={rating.label}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleRatingToggle(rating.value)}
                            className="peer sr-only"
                          />
                          <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-orange-600 peer-checked:border-orange-600 flex items-center justify-center transition-all">
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
            </div>

            {/* Footer Buttons */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
              <button
                onClick={() => onFilterChange({})}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </TransitionChild>
      </div>
    </Transition>
  );
}

// app/components/booking/RecommendedActivities.tsx

"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { RecommendedCard, RecommendedItem } from "@/components/recommendations/RecommendedCard";

interface RecommendedActivitiesProps {
  items: RecommendedItem[];
  title?: string;
}

export function RecommendedActivities({ 
  items, 
  title = "Recommended Activities" 
}: RecommendedActivitiesProps) {
  const handleScroll = (direction: "left" | "right") => {
    const container = document.getElementById("recommended-scroll");
    const scrollAmount = direction === "left" ? -320 : 320;
    container?.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  if (items.length === 0) return null;

  return (
    <section className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          {title}
        </h2>

        {items.length > 3 && (
          <div className="flex gap-2">
            <button
              onClick={() => handleScroll("left")}
              className="p-2 rounded-full border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all"
              aria-label="Previous"
            >
              <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              className="p-2 rounded-full border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all"
              aria-label="Next"
            >
              <ChevronRightIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        )}
      </div>

      <div
        id="recommended-scroll"
        className={`${
          items.length > 3
            ? "flex gap-4 overflow-x-auto scrollbar-hide pb-2"
            : "grid grid-cols-1 md:grid-cols-3 gap-4"
        }`}
      >
        {items.map((item) => (
          <RecommendedCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

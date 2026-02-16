// app/components/booking/RecommendedActivities.tsx

"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { RecommendedCard, RecommendedItem } from "@/components/recommendations/RecommendedCard";

interface RecommendedActivitiesProps {
  items: RecommendedItem[];
  title?: string;
  layout?: "scroll" | "grid";
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

  if (items.length === 0) {
    // Show dummy data when no items are provided
    const dummyItems: RecommendedItem[] = [
      {
        id: '1',
        title: 'Rishikesh River Rafting',
        location: 'Rishikesh',
        duration: '3 Hours',
        tag: 'Adventure',
        badgeRight: 'Best Seller',
        rating: 4.8,
        ratingCount: 256,
        image: '/images/river-rafting-rishikesh.jpg',
        priceLabel: 'per person',
        price: '₹2,500',
      },
      {
        id: '2',
        title: 'Ganga Aarti Experience',
        location: 'Haridwar',
        duration: '2 Hours',
        tag: 'Cultural',
        badgeRight: 'Top Rated',
        rating: 4.9,
        ratingCount: 489,
        image: '/images/rishikesh-ganga-arti.jpg',
        priceLabel: 'per person',
        price: '₹800',
      },
      {
        id: '3',
        title: 'Yoga & Meditation Retreat',
        location: 'Rishikesh',
        duration: '5 Days',
        tag: 'Wellness',
        badgeRight: 'Popular',
        rating: 4.7,
        ratingCount: 178,
        image: '/images/yoga-ashram-rishikesh.jpg',
        priceLabel: 'per person',
        price: '₹5,000',
      },
    ];
    
    return (
      <section className="bg-white border-b border-gray-400 px-4 py-10 sm:pl-4 ">
        <div className="mb-4">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
            {title}
          </h2>
        <div className="mt-2 h-1 w-16 bg-primary rounded-full" />
        </div>

        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
          {dummyItems.map((item) => (
            <RecommendedCard key={item.id} item={item} />
          ))}
        </div>
      </section>
    );
  }

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
          items.length > 2
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

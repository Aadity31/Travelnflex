"use client";

import Image from "next/image";
import { MapPinIcon, StarIcon } from "@heroicons/react/24/solid";

export interface RecommendedItem {
  id: string;
  title: string;
  location: string;
  duration: string;
  tag?: string;
  badgeRight?: string;
  rating: number;
  ratingCount: number;
  image: string;
  priceLabel: string;
  price: string;
}

interface RecommendedCardProps {
  item: RecommendedItem;
}

export function RecommendedCard({ item }: RecommendedCardProps) {
  return (
    <article className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative h-36 sm:h-40 bg-gray-100">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />

        {/* Top badges */}
        <div className="absolute top-2 left-2 flex gap-1">
          {item.tag && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-500 text-white">
              {item.tag}
            </span>
          )}
          {item.badgeRight && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-yellow-400 text-gray-900">
              {item.badgeRight}
            </span>
          )}
        </div>

        {/* Rating badge */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[11px] shadow-sm">
          <StarIcon className="w-3.5 h-3.5 text-yellow-400" />
          <span className="font-medium text-gray-900 text-xs">
            {item.rating.toFixed(1)}
          </span>
          <span className="text-[11px] text-gray-500">
            ({item.ratingCount})
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 space-y-2">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2">
          {item.title}
        </h3>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <MapPinIcon className="w-3.5 h-3.5 text-orange-500" />
            <span>{item.location}</span>
          </span>
          <span className="h-1 w-1 rounded-full bg-gray-300" />
          <span>{item.duration}</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-gray-500">
            <div>{item.priceLabel}</div>
            <div className="text-sm font-semibold text-gray-900">
              {item.price}
            </div>
          </div>

          <button className="px-3 py-1.5 rounded-full text-xs font-semibold border border-gray-200 text-gray-800 hover:border-orange-500 hover:text-orange-600 transition-colors">
            View Details
          </button>
        </div>
      </div>
    </article>
  );
}

export const dummyRecommendedItems: RecommendedItem[] = [
  {
    id: "1",
    title: "Evening Ganga Aarti",
    location: "Haridwar",
    duration: "1.5 hours",
    tag: "Spiritual",
    badgeRight: "Popular",
    rating: 4.8,
    ratingCount: 540,
    image: "/images/dummy-ganga-aarti.jpg",
    priceLabel: "Starting from",
    price: "₹500",
  },
  {
    id: "2",
    title: "White Water Rafting",
    location: "Rishikesh",
    duration: "3 hours",
    tag: "Adventure",
    badgeRight: "Popular",
    rating: 4.9,
    ratingCount: 620,
    image: "/images/dummy-rafting.jpg",
    priceLabel: "Starting from",
    price: "₹1,499",
  },
  {
    id: "3",
    title: "Ayurvedic Massage",
    location: "Tapovan",
    duration: "2 hours",
    tag: "Wellness",
    badgeRight: undefined,
    rating: 4.7,
    ratingCount: 310,
    image: "/images/dummy-massage.jpg",
    priceLabel: "Starting from",
    price: "₹2,000",
  },
];

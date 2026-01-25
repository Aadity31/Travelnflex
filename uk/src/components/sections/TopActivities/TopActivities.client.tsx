"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  StarIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  UserGroupIcon,
  FireIcon,
  SparklesIcon,
  PlayCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";

import WishlistButton from "@/components/wishlist/WishlistButton";
import { useWishlistStore } from "@/lib/wishlist/store";
import LoginPrompt from "@/components/auth/LoginPrompt";

// Types
interface TopActivity {
  id: string;
  name: string;
  slug: string;
  type: "adventure" | "spiritual" | "cultural" | "food" | "trekking";
  description: string;
  shortDescription: string;
  duration: string;
  location: string;
  price: {
    min: number;
    max: number;
    currency: "INR";
  };
  difficulty: "easy" | "moderate" | "difficult";
  rating: number;
  reviewCount: number;
  images: string[];
  highlights: string[];
  maxGroupSize: number;
  isPopular: boolean;
  isTrending: boolean;
  discount?: {
    percentage: number;
    validUntil: string;
  };
}

const activityTypes = [
  { value: "all", label: "All Activities", icon: SparklesIcon },
  { value: "adventure", label: "Adventure", icon: FireIcon },
  { value: "spiritual", label: "Spiritual", icon: StarIcon },
  { value: "cultural", label: "Cultural", icon: StarIcon },
  { value: "trekking", label: "Trekking", icon: MapPinIcon },
];

// Activity Card Component
interface ActivityCardProps {
  activity: TopActivity;
  wishlist: ReturnType<typeof useWishlistStore>;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, wishlist }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "moderate":
        return "bg-yellow-100 text-yellow-800";
      case "difficult":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "adventure":
        return "bg-red-500";
      case "spiritual":
        return "bg-purple-500";
      case "cultural":
        return "bg-blue-500";
      case "trekking":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) =>
      prev === activity.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) =>
      prev === 0 ? activity.images.length - 1 : prev - 1
    );
  };

  return (
    <Link href={`/booking/activity/${activity.slug}`} className="block">
      <article className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
        {/* Image Container - Responsive heights */}
        <div className="relative h-56 sm:h-64 md:h-72 overflow-hidden">
          <Image
            src={activity.images[currentImageIndex]}
            alt={`${activity.name} - ${activity.shortDescription}`}
            fill
            className={`object-cover group-hover:scale-110 transition-transform duration-700 ${
              imageLoading ? "blur-sm" : "blur-0"
            }`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onLoad={() => setImageLoading(false)}
          />

          {/* Loading overlay */}
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="text-gray-400 text-sm">Loading...</div>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Image Navigation */}
          {activity.images.length > 1 && (
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              <button
                onClick={prevImage}
                className="bg-black/70 hover:bg-black text-white rounded-full p-1.5 sm:p-2 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="bg-black/70 hover:bg-black text-white rounded-full p-1.5 sm:p-2 transition-colors"
                aria-label="Next image"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Top badges and wishlist - Fixed layout */}
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex justify-between items-start z-20">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${getTypeColor(
                  activity.type
                )}`}
              >
                {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
              </span>

              {activity.isPopular && (
                <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <FireIcon className="w-3 h-3" />
                  Popular
                </span>
              )}

              {activity.isTrending && (
                <span className="bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <SparklesIcon className="w-3 h-3" />
                  Trending
                </span>
              )}
            </div>

            {/* Wishlist button - Top Right Corner */}
            <div className="flex-shrink-0">
              <WishlistButton
                liked={wishlist.get(activity.id)}
                onToggle={() => wishlist.toggle(activity.id)}
                size="sm"
              />
            </div>
          </div>

          {/* Discount Badge - Bottom Left */}
          {activity.discount && (
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 bg-green-500 text-white px-2.5 py-1 rounded-full text-xs sm:text-sm font-bold z-10">
              {activity.discount.percentage}% OFF
            </div>
          )}

          {/* Rating - Bottom Right */}
          <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 bg-white/95 backdrop-blur-sm rounded-full px-2.5 sm:px-3 py-1 flex items-center gap-1 z-10">
            <StarSolidIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
            <span className="font-semibold text-xs sm:text-sm">
              {activity.rating}
            </span>
            <span className="text-xs text-gray-600">
              ({activity.reviewCount})
            </span>
          </div>
        </div>

        {/* Content - Responsive padding */}
        <div className="p-4 sm:p-5">
          {/* Location and Duration */}
          <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <MapPinIcon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{activity.location}</span>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <ClockIcon className="w-4 h-4" />
              <span>{activity.duration}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300 leading-tight">
            {activity.name}
          </h3>

          {/* Description */}
          <p className="text-gray-700 mb-4 text-sm leading-relaxed line-clamp-2">
            {activity.shortDescription}
          </p>

          {/* Highlights */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {activity.highlights.slice(0, 3).map((highlight, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                >
                  {highlight}
                </span>
              ))}
              {activity.highlights.length > 3 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{activity.highlights.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Details Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <UserGroupIcon className="w-4 h-4 flex-shrink-0" />
                <span>Max {activity.maxGroupSize}</span>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                  activity.difficulty
                )}`}
              >
                {activity.difficulty.charAt(0).toUpperCase() +
                  activity.difficulty.slice(1)}
              </span>
            </div>
          </div>

          {/* Price and CTA */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              <CurrencyRupeeIcon className="w-5 h-5 text-gray-900 flex-shrink-0" />
              <div>
                {activity.price.min === activity.price.max ? (
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">
                    {activity.price.min.toLocaleString("en-IN")}
                  </span>
                ) : (
                  <span className="text-base sm:text-lg font-bold text-gray-900">
                    {activity.price.min.toLocaleString("en-IN")} -{" "}
                    {activity.price.max.toLocaleString("en-IN")}
                  </span>
                )}
                {activity.discount && (
                  <div className="text-xs text-gray-500 line-through">
                    ₹
                    {Math.round(
                      activity.price.min /
                        (1 - activity.discount.percentage / 100)
                    ).toLocaleString("en-IN")}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-orange-600 hover:bg-orange-700 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2 text-sm whitespace-nowrap flex-shrink-0">
              Book Now
              <PlayCircleIcon className="w-4 h-4" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

// Main TopActivities Component
const TopActivities: React.FC<{
  activities: TopActivity[];
}> = ({ activities }) => {
  const wishlist = useWishlistStore();
  const fetchedRef = useRef(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const ids = activities.map((a) => a.id);
    wishlist.fetchBulk(ids);
  }, [activities, wishlist]);

  const filteredActivities = useMemo(() => {
    if (activeFilter === "all") return activities;
    return activities.filter((activity) => activity.type === activeFilter);
  }, [activeFilter, activities]);

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Top Experiences
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Adventure & Spiritual
            <span className="text-orange-600 block mt-2">Activities</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Discover a perfect blend of thrilling adventures and soul-enriching
            spiritual experiences in the sacred lands of Rishikesh and Haridwar.
          </p>
        </div>

        {/* Activity Type Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 mb-12">
          {activityTypes.map((type) => {
            const IconComponent = type.icon;
            const isActive = activeFilter === type.value;

            return (
              <button
                key={type.value}
                onClick={() => setActiveFilter(type.value)}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base ${
                  isActive
                    ? "bg-orange-600 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                }`}
              >
                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">{type.label}</span>
                <span className="sm:hidden">{type.label.split(" ")[0]}</span>
                {type.value !== "all" && (
                  <span
                    className={`px-1.5 sm:px-2 py-0.5 rounded-full text-xs ${
                      isActive ? "bg-white/20" : "bg-gray-200"
                    }`}
                  >
                    {activities.filter((a) => a.type === type.value).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Activities Grid - 3 columns on large screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {filteredActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} wishlist={wishlist} />
          ))}
        </div>

        {/* Login Prompt */}
        <LoginPrompt open={wishlist.showLogin} onClose={wishlist.closeLogin} />

        {/* No Results */}
        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              No activities found
            </h3>
            <p className="text-gray-600 mb-6">
              Try selecting a different category
            </p>
            <button
              onClick={() => setActiveFilter("all")}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors"
            >
              Show All Activities
            </button>
          </div>
        )}

        {/* View All CTA */}
        <div className="text-center">
          <Link
            href="/activities"
            className="inline-flex items-center gap-3 bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-orange-700 transition-all duration-300 hover:shadow-lg hover:scale-105 text-base"
          >
            Explore All Activities
            <SparklesIcon className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopActivities;

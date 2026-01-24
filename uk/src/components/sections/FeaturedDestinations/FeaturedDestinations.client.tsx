"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  StarIcon,
  MapPinIcon,
  EyeIcon,
  ArrowRightIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

import WishlistButton from "@/components/wishlist/WishlistButton";
import { useWishlistStore } from "@/lib/wishlist/store";
import LoginPrompt from "@/components/auth/LoginPrompt";


/* ---------------- TYPES ---------------- */

interface FeaturedDestination {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  image: string;
  location: string;
  rating: number;
  reviewCount: number;
  popularActivities: string[];
  bestTimeToVisit: string;
  startingPrice: number;
  badgeText?: string;
  badgeType?: "popular" | "trending" | "new";
}

interface FeaturedDestinationsClientProps {
  destinations: FeaturedDestination[];
}

/* ---------------- BADGE ---------------- */

interface BadgeProps {
  text: string;
  type: "popular" | "trending" | "new";
}

const Badge: React.FC<BadgeProps> = ({ text, type }) => {
  const getBadgeStyles = () => {
    switch (type) {
      case "popular":
        return "bg-orange-500 text-white";
      case "trending":
        return "bg-purple-500 text-white";
      case "new":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <span
      className={`inline-block px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${getBadgeStyles()}`}
    >
      {text}
    </span>
  );
};

/* ---------------- DESTINATION CARD ---------------- */

interface DestinationCardProps {
  destination: FeaturedDestination;
  // 🔹 Added: pass wishlist store down instead of calling hook here
  wishlist: ReturnType<typeof useWishlistStore>;
}

const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  wishlist,
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  return (
    <Link
                  key={destination.id}
                  href={`/booking/destination/${destination.slug}`}
                  className="block"
                >
    <article className="group bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
        {!imageError ? (
          <Image
            src={destination.image}
            alt={`${destination.name} - ${destination.shortDescription}`}
            fill
            className={`object-cover group-hover:scale-110 transition-transform duration-700 ${imageLoading ? "blur-sm" : "blur-0"
              }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={destination.badgeType === "popular"}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <EyeIcon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2" />
              <span className="text-xs sm:text-sm">Image unavailable</span>
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {imageLoading && !imageError && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-400 text-xs sm:text-sm">
              Loading...
            </div>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

        {/* Top badges and wishlist */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex justify-between items-start">
          {destination.badgeText && destination.badgeType && (
            <Badge
              text={destination.badgeText}
              type={destination.badgeType}
            />
          )}

          {/* 🔹 Wishlist button now uses global store instead of API calls */}
          <WishlistButton
            liked={wishlist.get(destination.id)}
            onToggle={() => wishlist.toggle(destination.id)}
            size="sm"
          />

          <LoginPrompt
            open={wishlist.showLogin}
            onClose={wishlist.closeLogin}
          />

        </div>

        {/* Rating badge */}
        <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 bg-white/95 backdrop-blur-sm rounded-full px-2 sm:px-3 py-1 flex items-center gap-1">
          <StarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
          <span className="font-semibold text-xs sm:text-sm text-gray-900">
            {destination.rating}
          </span>
          <span className="text-[10px] sm:text-xs text-gray-600">
            ({destination.reviewCount})
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 md:p-6">
        {/* Location */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-gray-600 mb-2 sm:mb-3">
          <MapPinIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium truncate">
            {destination.location}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-orange-600 transition-colors duration-300">
          {destination.name}
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 leading-relaxed">
          {destination.shortDescription}
        </p>

        {/* Activities */}
        <div className="mb-3 sm:mb-4">
          <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
            Popular Activities:
          </h4>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {destination.popularActivities
              .slice(0, 3)
              .map((activity, index) => (
                <span
                  key={index}
                  className="bg-orange-50 text-orange-700 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium border border-orange-200"
                >
                  {activity}
                </span>
              ))}
            {destination.popularActivities.length > 3 && (
              <span className="text-[10px] sm:text-xs text-gray-500 px-1.5 sm:px-2 py-0.5 sm:py-1">
                +{destination.popularActivities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Best time and price */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
            <ClockIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>
              Best time: {destination.bestTimeToVisit}
            </span>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              ₹{destination.startingPrice.toLocaleString("en-IN")}
            </div>
            <div className="text-[10px] sm:text-xs text-gray-500">
              per person
            </div>
          </div>r
        </div>

        {/* CTA Button */}
        <div
  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold text-center block transition-all duration-300 hover:shadow-lg group-hover:bg-orange-700 flex items-center justify-center gap-2 text-sm sm:text-base"
>
  Explore Destination
  <ArrowRightIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
</div>

      </div>
    </article>
    </Link>
  );
};

/* ---------------- MAIN COMPONENT ---------------- */

const FeaturedDestinations: React.FC<FeaturedDestinationsClientProps> = ({
  destinations,
}) => {
  // 🔹 Added: initialize global wishlist store inside component (hooks rule)
  const wishlist = useWishlistStore();
  const fetchedRef = useRef(false);
  // 🔹 Added: bulk fetch wishlist status for all 6 cards on page load
  useEffect(() => {
    if (fetchedRef.current) return; // 🔒 stop loop
    fetchedRef.current = true;

    const ids = destinations.map((d) => d.id);
    wishlist.fetchBulk(ids);
  }, [destinations]);


  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <div className="inline-block bg-orange-100 text-orange-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
            Sacred Destinations
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 px-4">
            Discover Your Perfect
            <span className="text-orange-600 block mt-1">
              Spiritual Journey
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Explore the spiritual heartland of India with our carefully curated
            destinations, each offering unique experiences from ancient temples
            to adventure sports.
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
          {destinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              wishlist={wishlist} // 🔹 Added: pass store down to card
            />
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center px-4">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 sm:gap-3 bg-white text-orange-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold border-2 border-orange-600 hover:bg-orange-600 hover:text-white transition-all duration-300 hover:shadow-lg text-sm sm:text-base"
          >
            View All Destinations
            <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;

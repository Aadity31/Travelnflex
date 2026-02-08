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
        return "bg-[var(--color-primary)] text-white";
      case "trending":
        return "bg-purple-500 text-white";
      case "new":
        return "bg-[var(--color-success)] text-white";
      default:
        return "bg-[var(--color-neutral)] text-white";
    }
  };

  return (
    <span
      className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getBadgeStyles()}`}
    >
      {text}
    </span>
  );
};

/* ---------------- DESTINATION CARD ---------------- */

interface DestinationCardProps {
  destination: FeaturedDestination;
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
      href={`/booking/destination/${destination.slug}`}
      className="block h-full"
    >
      <article className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
        {/* Image Container - Balanced heights */}
        <div className="relative h-56 sm:h-64 md:h-72 lg:h-80 overflow-hidden">
          {!imageError ? (
            <Image
              src={destination.image}
              alt={`${destination.name} - ${destination.shortDescription}`}
              fill
              className={`object-cover group-hover:scale-110 transition-transform duration-700 ${
                imageLoading ? "blur-sm" : "blur-0"
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 45vw"
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
                <EyeIcon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2" />
                <span className="text-sm">Image unavailable</span>
              </div>
            </div>
          )}

          {/* Loading overlay */}
          {imageLoading && !imageError && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="text-gray-400 text-sm">Loading...</div>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

          {/* Top badges and wishlist - Fixed positioning */}
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex justify-between items-start">
            <div>
              {destination.badgeText && destination.badgeType && (
                <Badge text={destination.badgeText} type={destination.badgeType} />
              )}
            </div>

            {/* Wishlist button - Top Right Corner */}
            <div className="flex-shrink-0">
              <WishlistButton
                liked={wishlist.get(destination.id)}
                onToggle={() => wishlist.toggle(destination.id)}
                size="sm"
              />
            </div>
          </div>

          {/* Rating badge - Bottom Right */}
          <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 bg-white/95 backdrop-blur-sm rounded-full px-2.5 sm:px-3 py-1 flex items-center gap-1">
            <StarIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
            <span className="font-semibold text-xs sm:text-sm text-gray-900">
              {destination.rating}
            </span>
            <span className="text-xs text-gray-600">
              ({destination.reviewCount})
            </span>
          </div>
        </div>

        {/* Content - Balanced padding */}
        <div className="p-5 sm:p-6 flex flex-col flex-grow">
          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600 mb-3">
            <MapPinIcon className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium truncate">
              {destination.location}
            </span>
          </div>

          {/* Title - Readable sizes */}
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-[var(--color-primary)] transition-colors duration-300 leading-tight">
            {destination.name}
          </h3>

          {/* Description */}
          <p className="text-sm sm:text-base text-gray-700 mb-4 line-clamp-3 leading-relaxed min-h-[4.5rem]">
            {destination.shortDescription}
          </p>

          {/* Activities */}
          <div className="mb-4 flex-grow">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              Popular Activities:
            </h4>
            <div className="flex flex-wrap gap-2">
              {destination.popularActivities.slice(0, 3).map((activity, index) => (
                <span
                  key={index}
                  className="bg-[var(--color-primary-lightest)] text-[var(--color-primary-dark)] px-2.5 py-1 rounded-full text-xs font-medium border border-[var(--color-primary-light)]"
                >
                  {activity}
                </span>
              ))}
              {destination.popularActivities.length > 3 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{destination.popularActivities.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Best time and price */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ClockIcon className="w-4 h-4 flex-shrink-0" />
              <span>Best time: {destination.bestTimeToVisit}</span>
            </div>
            <div className="text-left sm:text-right">
              <div className="text-2xl font-bold text-gray-900">
                ₹{destination.startingPrice.toLocaleString("en-IN")}
              </div>
              <div className="text-xs text-gray-500">per person</div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="w-full bg-[var(--color-primary-dark)] hover:bg-[var(--color-primary)] text-white py-3 px-5 rounded-lg font-semibold text-center transition-all duration-300 hover:shadow-lg group-hover:bg-[var(--color-primary)] flex items-center justify-center gap-2 text-base">
            Explore Destination
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
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
  const wishlist = useWishlistStore();
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const ids = destinations.map((d) => d.id);
    wishlist.fetchBulk(ids);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destinations]);

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Readable sizes */}
        <div className="text-center mb-12">
          <div className="inline-block bg-[var(--color-primary-lightest)] text-[var(--color-primary)] px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Sacred Destinations
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 px-4">
            Discover Your Perfect
            <span className="text-[var(--color-primary-dark)] block mt-2">
              Spiritual Journey
            </span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Explore the spiritual heartland of India with our carefully curated
            destinations, each offering unique experiences from ancient temples to
            adventure sports.
          </p>
        </div>

        {/* Destinations Grid - Proper spacing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12">
          {destinations.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              wishlist={wishlist}
            />
          ))}
        </div>

        {/* Login Prompt */}
        <LoginPrompt open={wishlist.showLogin} onClose={wishlist.closeLogin} />

        {/* View All CTA */}
        <div className="text-center px-4">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-3 bg-white text-[var(--color-primary-dark)] px-8 py-4 rounded-xl font-semibold border-2 border-[var(--color-primary-dark)] hover:bg-[var(--color-primary-dark)] hover:text-white transition-all duration-300 hover:shadow-lg text-base"
          >
            View All Destinations
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;

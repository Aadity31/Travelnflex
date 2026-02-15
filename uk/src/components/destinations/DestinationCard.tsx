import Image from "next/image";
import Link from "next/link";
import {
  StarIcon,
  MapPinIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import WishlistButton from "@/components/wishlist/WishlistButton";

export interface DestinationCardProps {
  destination: {
    id: string;
    name: string;
    slug: string;
    shortDescription: string;
    image: string;
    location: string;
    rating: number;
    reviewCount: number;
    highlights?: string[];
    bestTimeToVisit?: string;
    startingPrice: number;
    discount?: {
      percentage: number;
      validUntil: string;
    };
  };
  isLiked: boolean;
  onWishlistToggle: () => Promise<void>;
}

export default function DestinationCard({
  destination,
  isLiked,
  onWishlistToggle,
}: DestinationCardProps) {
  return (
    <Link
      href={`/booking/destination/${destination.slug}`}
      className="block"
    >
      <article className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row">
        {/* Image Section */}
        <div className="relative w-full sm:w-64 md:w-80 lg:w-96 h-40 sm:h-auto flex-shrink-0">
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 400px"
          />

          {/* Featured Badge */}
          <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
            <span className="px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold text-white shadow-md bg-orange-500">
              Featured
            </span>
          </div>

          {/* Wishlist Button */}
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
            <WishlistButton
              liked={isLiked}
              onToggle={onWishlistToggle}
              size="sm"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-2.5 sm:p-3 md:p-4 flex flex-col">
          <div className="flex-1">
            {/* Title and Rating */}
            <div className="mb-1.5">
              <div className="flex items-start justify-between gap-2 mb-0.5">
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 hover:text-orange-600 transition-colors line-clamp-1">
                  {destination.name}
                </h3>

                {/* Rating Badge */}
                <div className="flex items-center gap-0.5 bg-blue-600 text-white px-1.5 py-0.5 rounded flex-shrink-0">
                  <span className="text-[10px] sm:text-xs font-bold">
                    {destination.rating}
                  </span>
                  <StarIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                </div>
              </div>

              <div className="flex items-center gap-1 text-gray-600 text-[10px] sm:text-xs">
                <MapPinIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="line-clamp-1">
                  {destination.location}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-xs mb-2 line-clamp-2">
              {destination.shortDescription}
            </p>

            {/* Highlights */}
            <div className="mb-2">
              <div className="flex flex-wrap gap-1.5">
                {(destination.highlights ?? [])
                  .slice(0, 3)
                  .map((highlight, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-0.5 text-[10px] sm:text-xs text-gray-700"
                    >
                      <svg
                        className="w-3 h-3 text-green-600 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="line-clamp-1">
                        {highlight}
                      </span>
                    </div>
                  ))}
                {(destination.highlights?.length ?? 0) > 3 && (
                  <span className="text-[10px] text-gray-500">
                    +{destination.highlights!.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Best Time */}
            <div className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-600">
              <ClockIcon className="w-3 h-3" />
              <span>Best: {destination.bestTimeToVisit}</span>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex items-end justify-between mt-2 pt-2 border-t border-gray-200">
            <div>
              {destination.startingPrice > 0 ? (
                <>
                  <div className="text-[10px] text-gray-500 line-through leading-none">
                    ₹
                    {Math.round(
                      destination.discount
                        ? destination.startingPrice /
                            (1 - destination.discount.percentage / 100)
                        : destination.startingPrice * 1.2
                    )}
                  </div>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-lg sm:text-xl font-bold text-gray-900">
                      ₹{destination.startingPrice}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-gray-500 leading-none">
                      Per Person
                    </span>
                    <span className="text-[10px] text-gray-300 leading-none">
                      •
                    </span>
                    <span className="text-[10px] text-gray-500 leading-none">
                      ({destination.reviewCount} Reviews)
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-[10px] text-gray-500 leading-none">
                  ({destination.reviewCount} Reviews)
                </div>
              )}
            </div>

            <div className="bg-orange-600 hover:bg-orange-700 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg font-semibold transition-colors duration-200 text-xs whitespace-nowrap">
              View Details
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

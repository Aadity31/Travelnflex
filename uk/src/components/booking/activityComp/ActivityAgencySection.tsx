import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  BuildingOffice2Icon,
  StarIcon,
  CheckBadgeIcon,
  MapPinIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface AgencySectionProps {
  agencyName: string;
  agencyLogo?: string;
  location: string;
  rating: number;
  reviewCount: number;
  isVerified?: boolean;
  agencySlug: string;
}

export default function AgencySection({
  agencyName,
  agencyLogo,
  location,
  rating,
  reviewCount,
  isVerified = false,
  agencySlug,
}: AgencySectionProps) {
  // Render star rating
  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const filled = index < Math.floor(rating);
      return filled ? (
        <StarSolidIcon key={index} className="w-4 h-4 text-amber-400" />
      ) : (
        <StarIcon key={index} className="w-4 h-4 text-gray-300" />
      );
    });
  };

  return (
    <section className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Agency Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Logo */}
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 ring-2 ring-gray-100">
                {agencyLogo ? (
                  <Image
                    src={agencyLogo}
                    alt={agencyName}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-500">
                    <BuildingOffice2Icon className="w-7 h-7 text-white" />
                  </div>
                )}
              </div>
              {/* Verified badge */}
              {isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                  <CheckBadgeIcon className="w-4 h-4 text-blue-500" />
                </div>
              )}
            </div>

            {/* Agency Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-gray-900 truncate">
                  {agencyName}
                </h3>
                {isVerified && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded shrink-0">
                    <CheckBadgeIcon className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>

              {/* Rating & Location */}
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1">
                  {renderStars()}
                  <span className="ml-1 font-semibold text-gray-900">
                    {rating.toFixed(1)}
                  </span>
                  <span className="text-gray-500">({reviewCount})</span>
                </div>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPinIcon className="w-4 h-4" />
                  <span className="truncate">{location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: View Profile Button */}
          <Link
            href={`/agencies/${agencySlug}`}
            className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-colors duration-200"
          >
            View
            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

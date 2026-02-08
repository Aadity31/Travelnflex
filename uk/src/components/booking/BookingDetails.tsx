// app/components/booking/BookingDetails.tsx

"use client";

import {
  MapPinIcon,
  ClockIcon,
  SparklesIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  BoltIcon,
} from "@heroicons/react/24/solid";

interface Agency {
  name: string;
  logo?: string;
  description?: string;
}

interface BookingDetailsProps {
  name: string;
  location: string;
  duration?: string;
  bestTimeToVisit?: string;
  difficulty?: string;
  description: string;
  highlights: string[];
  includes?: string[];
  type: "activity" | "destination";
}

export function BookingDetails({
  name,
  location,
  duration,
  bestTimeToVisit,
  difficulty,
  description,
  highlights,
  includes,
  type,
}: BookingDetailsProps) {
  return (
    <>
      {/* Title & Info */}
      <section className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2.5">{name}</h1>

        <div className="flex flex-wrap items-center gap-2 text-sm mb-3">
          <div className="flex items-center gap-1.5">
            <MapPinIcon className="w-4 h-4 text-orange-500" />
            <span className="font-medium text-gray-900">{location}</span>
          </div>

          {duration && (
            <>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1.5">
                <ClockIcon className="w-4 h-4 text-blue-500" />
                <span className="text-gray-700">{duration}</span>
              </div>
            </>
          )}

          {bestTimeToVisit && (
            <>
              <span className="text-gray-300">•</span>
              <div className="flex items-center gap-1.5">
                <SparklesIcon className="w-4 h-4 text-purple-500" />
                <span className="text-gray-700">Best: {bestTimeToVisit}</span>
              </div>
            </>
          )}

          {difficulty && (
            <>
              <span className="text-gray-300">•</span>
              <span className="bg-orange-500 text-white px-2.5 py-1 rounded-md text-xs font-semibold capitalize">
                {difficulty}
              </span>
            </>
          )}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap gap-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1.5 rounded-md">
            <ShieldCheckIcon className="w-3.5 h-3.5" />
            <span>Verified Operator</span>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-md">
            <BoltIcon className="w-3.5 h-3.5" />
            <span>Instant Confirmation</span>
          </div>
        </div>
      </section>

      {/* Description */}
      <section className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          About This Experience
        </h2>
        <p className="text-gray-700 leading-relaxed text-sm">{description}</p>
      </section>

      {/* Highlights */}
      {highlights.length > 0 && (
        <section className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            {type === "activity" ? "What's Included" : "Highlights"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {highlights.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Includes */}
      {(includes && includes.length > 0) && (
        <section className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-3">What's Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {includes.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

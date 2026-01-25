"use client";

import Image from "next/image";
import { StarIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

interface ItineraryDay {
  day: number;
  title: string;
  date: string;
  description: string;
  hotel?: {
    name: string;
    image: string;
    rating: number;
    features: string[];
  };
  activities?: {
    icon: string;
    label: string;
    name: string;
  }[];
  isHighlight?: boolean;
}

export default function ItinerarySection({
  itinerary,
  showAllDays,
  setShowAllDays,
}: {
  itinerary: ItineraryDay[];
  showAllDays: boolean;
  setShowAllDays: (v: boolean) => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">
        Detailed Itinerary
      </h3>

      <div className="relative pl-4 sm:pl-8 space-y-10">
        <div className="absolute top-2 left-4 sm:left-8 w-0.5 h-[calc(100%-20px)] bg-gray-200 -translate-x-1/2"></div>

        {itinerary.map((day, index) => (
          <div key={day.day} className="relative">
            <div
              className={`absolute top-0 left-0 sm:-left-8 -translate-x-1/2 ${
                index === 0
                  ? "bg-orange-500 text-white"
                  : "bg-white border-2 border-orange-500 text-orange-500"
              } w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 ring-4 ring-white`}
            >
              {day.day}
            </div>

            <div className="pl-6 sm:pl-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                <h4 className="text-lg font-bold text-gray-900">
                  {day.title}
                </h4>
                <span className="text-sm text-gray-500">
                  {day.date}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {day.description}
              </p>

              {day.activities && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {day.activities.map((activity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2 bg-white rounded border border-gray-200"
                    >
                      <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-orange-500 text-xl">
                        {activity.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-500">
                          {activity.label}
                        </div>
                        <div className="text-sm font-semibold">
                          {activity.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {day.isHighlight && (
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100 mb-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xl">
                    🕉️
                  </div>
                  <div>
                    <div className="text-sm font-bold text-orange-800">
                      Yamunotri Temple Darshan
                    </div>
                    <div className="text-xs text-orange-700/70">
                      Priority pass included in your package
                    </div>
                  </div>
                </div>
              )}

              {day.hotel && (
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 flex gap-4 items-start">
                  <div className="w-20 h-20 shrink-0 rounded-md overflow-hidden bg-gray-200">
                    <Image
                      src={day.hotel.image}
                      alt={day.hotel.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] font-bold tracking-wider text-gray-500 uppercase mb-1 block">
                      Night Stay
                    </span>
                    <h5 className="font-bold text-sm text-gray-900 mb-1">
                      {day.hotel.name}
                    </h5>
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex text-amber-400">
                        {[...Array(Math.floor(day.hotel.rating))].map(
                          (_, i) => (
                            <StarIcon key={i} className="w-3 h-3" />
                          )
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        ({day.hotel.rating})
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {day.hotel.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-600"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        <div className="relative">
          <div className="absolute top-0 left-0 sm:-left-8 -translate-x-1/2 bg-gray-200 text-gray-500 w-8 h-8 rounded-full flex items-center justify-center z-10 ring-4 ring-white">
            <ChevronDownIcon className="w-4 h-4" />
          </div>
          <div className="pl-6 sm:pl-0 pt-1">
            <button
              onClick={() => setShowAllDays(!showAllDays)}
              className="text-sm font-bold text-orange-500 hover:underline"
            >
              View remaining 7 days
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

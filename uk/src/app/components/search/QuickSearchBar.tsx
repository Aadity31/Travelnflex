"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  CalendarDaysIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

export default function QuickSearchBar() {
  const router = useRouter();
  const [searchData, setSearchData] = useState({
    destination: "",
    activity: "",
    date: "",
    guests: 1,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const searchParams = new URLSearchParams({
      destination: searchData.destination,
      activity: searchData.activity,
      date: searchData.date,
      guests: searchData.guests.toString(),
    });
    router.push(`/search?${searchParams.toString()}`);
  };

  return (
    <section className="relative bg-gradient-to-b from-transparent via-gray-50/50 to-gray-50 pt-12 sm:pt-14 md:pt-16 pb-6 sm:pb-8 -mt-16 sm:-mt-18 md:-mt-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, #f97316 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        ></div>
      </div>

      {/* Search Card */}
      <div className="relative z-20 max-w-6xl mx-auto px-3 sm:px-4 md:px-6">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl p-4 sm:p-5 md:p-6 border border-gray-100">
          <div className="text-center mb-4 sm:mb-5">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1">
              Find Your Perfect Journey
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm">
              Search for destinations, activities, and guides
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
          >
            {/* Destination Search */}
            <div className="relative">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                <MapPinIcon className="w-3.5 h-3.5 inline mr-1" />
                Destination
              </label>
              <select
                value={searchData.destination}
                onChange={(e) =>
                  setSearchData((prev) => ({
                    ...prev,
                    destination: e.target.value,
                  }))
                }
                className="w-full px-3 py-2.5 sm:py-2.5 border-2 border-gray-200 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 cursor-pointer appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: "right 0.5rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.5em 1.5em",
                  paddingRight: "2.5rem",
                }}
              >
                <option value="">All Destinations</option>
                <option value="rishikesh">Rishikesh</option>
                <option value="haridwar">Haridwar</option>
                <option value="both">Both Cities</option>
              </select>
            </div>

            {/* Activity Type */}
            <div className="relative">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                <MagnifyingGlassIcon className="w-3.5 h-3.5 inline mr-1" />
                Activity Type
              </label>
              <select
                value={searchData.activity}
                onChange={(e) =>
                  setSearchData((prev) => ({
                    ...prev,
                    activity: e.target.value,
                  }))
                }
                className="w-full px-3 py-2.5 sm:py-2.5 border-2 border-gray-200 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 cursor-pointer appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: "right 0.5rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.5em 1.5em",
                  paddingRight: "2.5rem",
                }}
              >
                <option value="">All Activities</option>
                <option value="spiritual">Spiritual</option>
                <option value="adventure">Adventure</option>
                <option value="cultural">Cultural</option>
                <option value="trekking">Trekking</option>
              </select>
            </div>

            {/* Date */}
            <div className="relative">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                <CalendarDaysIcon className="w-3.5 h-3.5 inline mr-1" />
                Travel Date
              </label>
              <input
                type="date"
                value={searchData.date}
                onChange={(e) =>
                  setSearchData((prev) => ({ ...prev, date: e.target.value }))
                }
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2.5 sm:py-2.5 border-2 border-gray-200 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
              />
            </div>

            {/* Guests & Search Button */}
            <div className="space-y-3 sm:space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  <UserGroupIcon className="w-3.5 h-3.5 inline mr-1" />
                  Guests
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={searchData.guests}
                  onChange={(e) =>
                    setSearchData((prev) => ({
                      ...prev,
                      guests: parseInt(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2.5 sm:py-2.5 border-2 border-gray-200 rounded-lg text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                className="group w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-2.5 sm:py-2.5 px-4 sm:px-5 rounded-lg text-sm font-semibold transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 flex items-center justify-center gap-2"
              >
                <MagnifyingGlassIcon className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                <span className="hidden sm:inline">Search Now</span>
                <span className="sm:hidden">Search</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

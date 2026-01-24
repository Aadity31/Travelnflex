"use client";

import { useState, useRef, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const DUMMY_SUGGESTIONS = [
  "Rishikesh",
  "Haridwar",
  "River Rafting",
  "Adventure Activities",
  "Spiritual Tours",
  "Trekking",
  "Yoga Retreat",
];

export default function QuickSearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = DUMMY_SUGGESTIONS.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 6);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
        />
      </div>

      <div className="flex justify-center px-4">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl px-10 py-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-medium text-gray-900">
              Plan your journey
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Search destinations, activities, and local experiences
            </p>
          </div>

          {/* SEARCH BAR */}
          <div className="relative max-w-4xl mx-auto">
            <div
              className="relative flex items-center bg-white rounded-3xl
                border border-gray-300 shadow-xl"
            >
              <MagnifyingGlassIcon className="absolute left-5 w-6 h-6 text-gray-400" />

              <input
                type="text"
                value={query}
                onFocus={() => setOpen(true)}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
                }}
                placeholder="Search places, activities, tours..."
                className="w-full h-12 pl-14 pr-16 rounded-3xl
             text-base text-gray-900 focus:outline-none"
              />

              <button
                className="absolute right-3 h-8 w-8 rounded-full
               bg-orange-600 text-white
               flex items-center justify-center
               hover:bg-orange-700 transition"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Suggestions */}
            {open && query && (
              <div
                className="absolute z-50 mt-1 w-full bg-white
                 rounded-2xl border border-gray-200
                 shadow-xl overflow-hidden"
              >
                {filtered.length > 0 ? (
                  filtered.map((item) => (
                    <div
                      key={item}
                      onClick={() => {
                        setQuery(item);
                        setOpen(false);
                      }}
                      className="flex items-center gap-3 px-5 py-3
                       text-sm text-gray-800 cursor-pointer
                       hover:bg-orange-50 transition"
                    >
                      <MagnifyingGlassIcon className="w-4 h-4 text-orange-500" />
                      {item}
                    </div>
                  ))
                ) : (
                  <div className="px-5 py-3 text-sm text-gray-500">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

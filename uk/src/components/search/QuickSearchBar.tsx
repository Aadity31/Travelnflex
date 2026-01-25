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

// Typewriter placeholder texts
const PLACEHOLDER_TEXTS = [
  "Search Rishikesh adventures...",
  "Find spiritual tours...",
  "Explore trekking trails...",
  "Discover yoga retreats...",
  "Book river rafting...",
];

export default function QuickSearchBar() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = DUMMY_SUGGESTIONS.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 6);

  // Typewriter effect logic
  useEffect(() => {
    if (isFocused || query) return; // Don't animate when focused or typing

    const currentText = PLACEHOLDER_TEXTS[loopNum % PLACEHOLDER_TEXTS.length];
    const timeout = isDeleting ? 50 : 150;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        setDisplayText(currentText.substring(0, displayText.length + 1));
        
        if (displayText === currentText) {
          // Finished typing, wait then start deleting
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Deleting
        setDisplayText(currentText.substring(0, displayText.length - 1));
        
        if (displayText === "") {
          // Finished deleting, move to next text
          setIsDeleting(false);
          setLoopNum(loopNum + 1);
        }
      }
    }, timeout);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, loopNum, isFocused, query]);

  // Close on outside click
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
    <section className="relative bg-gradient-to-b from-transparent via-gray-50/50 to-gray-50 pt-8 sm:pt-12 md:pt-16 pb-4 sm:pb-6 md:pb-8 -mt-12 sm:-mt-16 md:-mt-20">
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

      <div className="flex justify-center px-4 sm:px-6">
        <div className="w-full max-w-6xl bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl px-4 sm:px-8 md:px-10 py-6 sm:py-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-900">
              Plan your journey
            </h2>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-500">
              Search destinations, activities, and local experiences
            </p>
          </div>

          {/* SEARCH BAR with Typewriter Effect */}
          <div ref={wrapperRef} className="relative max-w-4xl mx-auto">
            <div className="relative flex items-center bg-white rounded-full sm:rounded-3xl border border-gray-300 shadow-lg sm:shadow-xl">
              {/* Search Icon */}
              <MagnifyingGlassIcon className="absolute left-3 sm:left-4 md:left-5 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-gray-400 pointer-events-none z-10" />

              {/* Input */}
              <input
                type="text"
                value={query}
                onFocus={() => {
                  setIsFocused(true);
                  setOpen(true);
                }}
                onBlur={() => {
                  setIsFocused(false);
                  if (!query) {
                    setDisplayText("");
                    setIsDeleting(false);
                  }
                }}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
                }}
                className="w-full h-11 sm:h-12 md:h-14 pl-10 sm:pl-12 md:pl-14 pr-12 sm:pr-14 md:pr-16 rounded-full sm:rounded-3xl text-sm sm:text-base text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
              />

              {/* Animated Placeholder with Blinking Cursor */}
              {!query && !isFocused && (
                <div className="absolute left-10 sm:left-12 md:left-14 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base pointer-events-none select-none">
                  <span className="inline-flex items-center">
                    {displayText}
                    <span className="inline-block w-0.5 h-4 sm:h-5 bg-orange-500 ml-0.5 animate-cursor-blink"></span>
                  </span>
                </div>
              )}

              {/* Search Button */}
              <button
                className="absolute right-2 sm:right-3 h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 rounded-full bg-orange-600 text-white flex items-center justify-center hover:bg-orange-700 transition"
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Suggestions Dropdown */}
            {open && query && (
              <div className="absolute z-50 mt-2 w-full bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                {filtered.length > 0 ? (
                  filtered.map((item) => (
                    <div
                      key={item}
                      onClick={() => {
                        setQuery(item);
                        setOpen(false);
                      }}
                      className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 text-sm sm:text-base text-gray-800 cursor-pointer hover:bg-orange-50 transition"
                    >
                      <MagnifyingGlassIcon className="w-4 h-4 text-orange-500 flex-shrink-0" />
                      <span className="truncate">{item}</span>
                    </div>
                  ))
                ) : (
                  <div className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 text-xs sm:text-sm text-gray-500">
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

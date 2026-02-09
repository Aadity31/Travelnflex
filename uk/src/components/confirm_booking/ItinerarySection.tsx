"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon, ClockIcon, MapPinIcon } from "@heroicons/react/24/solid";

interface ItineraryDay {
  day: number;
  title: string;
  date: string;
  description: string;
  activities?: {
    icon: string;
    label: string;
    name: string;
    time?: string;
  }[];
  isHighlight?: boolean;
  distance?: string;
  duration?: string;
}

// Complete dummy data for 10 days - Char Dham Yatra
const itineraryData: ItineraryDay[] = [
  {
    day: 1,
    title: "Arrival at Haridwar",
    date: "Day 1 - March 12",
    description: "Arrive at Haridwar railway station. Transfer to hotel and rest. Evening visit to Har Ki Pauri for the famous Ganga Aarti.",
    activities: [
      { icon: "🚗", label: "Transfer", name: "Hotel Check-in", time: "02:00 PM" },
      { icon: "🛕", label: "Visit", name: "Har Ki Pauri", time: "05:00 PM" },
      { icon: "🕉️", label: "Aarti", name: "Ganga Aarti", time: "06:30 PM" },
    ],
  },
  {
    day: 2,
    title: "Haridwar to Yamunotri",
    date: "Day 2 - March 13",
    description: "Early morning drive to Yamunotri. Trek to the temple and take a holy dip in Surya Kund. Return to base camp.",
    distance: "210 km from Haridwar",
    duration: "7–8 hours drive",
    activities: [
      { icon: "🚗", label: "Drive", name: "Haridwar to Janki Chatti", time: "06:00 AM" },
      { icon: "🥾", label: "Trek", name: "Yamunotri Temple Trek", time: "11:00 AM" },
      { icon: "♨️", label: "Hot Spring", name: "Surya Kund Dip", time: "12:30 PM" },
    ],
    isHighlight: true,
  },
  {
    day: 3,
    title: "Yamunotri to Uttarkashi",
    date: "Day 3 - March 14",
    description: "Trek back to Janki Chatti and drive to Uttarkashi. Visit Vishwanath Temple and explore local markets.",
    distance: "80 km from Yamunotri",
    duration: "3–4 hours drive",
    activities: [
      { icon: "🥾", label: "Trek Back", name: "Return to Janki Chatti", time: "08:00 AM" },
      { icon: "🛕", label: "Temple", name: "Vishwanath Temple", time: "03:00 PM" },
      { icon: "🛍️", label: "Shopping", name: "Local Market Visit", time: "05:00 PM" },
    ],
  },
  {
    day: 4,
    title: "Gangotri Darshan",
    date: "Day 4 - March 15",
    description: "Visit the sacred Gangotri Temple, source of River Ganga. Optional trek to Gaumukh glacier if weather permits.",
    distance: "100 km from Uttarkashi",
    duration: "3–4 hours drive",
    activities: [
      { icon: "🛕", label: "Temple Visit", name: "Gangotri Temple", time: "06:00 AM" },
      { icon: "🥾", label: "Trek", name: "Gaumukh Glacier (Optional)", time: "08:00 AM" },
      { icon: "📸", label: "Photography", name: "Bhagirathi Peaks View", time: "12:00 PM" },
    ],
    isHighlight: true,
  },
  {
    day: 5,
    title: "Kedarnath Journey Begins",
    date: "Day 5 - March 16",
    description: "Drive to Gaurikund and begin trek to Kedarnath. Helicopter option available. Reach Kedarnath by evening.",
    distance: "30 km trek from Gaurikund",
    duration: "6–7 hours trek",
    activities: [
      { icon: "🚗", label: "Drive", name: "Uttarkashi to Gaurikund", time: "05:00 AM" },
      { icon: "🚁", label: "Transport", name: "Helicopter Service", time: "07:00 AM" },
      { icon: "🥾", label: "Trek", name: "Kedarnath Temple Trek", time: "08:00 AM" },
    ],
  },
  {
    day: 6,
    title: "Kedarnath to Badrinath",
    date: "Day 6 - March 17",
    description: "Morning darshan at Kedarnath. Trek back and drive to Badrinath via Joshimath. Overnight stay at Badrinath.",
    distance: "220 km from Kedarnath",
    duration: "10–11 hours total",
    activities: [
      { icon: "🕉️", label: "Aarti", name: "Morning Aarti", time: "04:30 AM" },
      { icon: "🥾", label: "Trek", name: "Return to Gaurikund", time: "07:00 AM" },
      { icon: "🚗", label: "Drive", name: "Journey to Badrinath", time: "12:00 PM" },
    ],
    isHighlight: true,
  },
  {
    day: 7,
    title: "Badrinath Temple & Surroundings",
    date: "Day 7 - March 18",
    description: "Full day exploring Badrinath. Visit temple, Mana village (last Indian village), and nearby waterfalls.",
    activities: [
      { icon: "♨️", label: "Hot Spring", name: "Tapt Kund Holy Bath", time: "05:30 AM" },
      { icon: "🛕", label: "Temple", name: "Badrinath Darshan", time: "06:00 AM" },
      { icon: "🏘️", label: "Village", name: "Mana Village Visit", time: "10:00 AM" },
    ],
  },
  {
    day: 8,
    title: "Explore Badrinath Valley",
    date: "Day 8 - March 19",
    description: "Visit Brahma Kapal, Charanpaduka, and other nearby attractions. Evening free for personal exploration.",
    activities: [
      { icon: "🙏", label: "Ritual", name: "Brahma Kapal Puja", time: "06:00 AM" },
      { icon: "🥾", label: "Trek", name: "Charanpaduka", time: "09:00 AM" },
      { icon: "🏔️", label: "Viewpoint", name: "Neelkanth Peak View", time: "11:00 AM" },
    ],
  },
  {
    day: 9,
    title: "Return Journey – Rishikesh",
    date: "Day 9 - March 20",
    description: "Start return journey to Rishikesh. Visit Lakshman Jhula, Ram Jhula, and attend evening Ganga Aarti at Triveni Ghat.",
    distance: "295 km from Badrinath",
    duration: "9–10 hours drive",
    activities: [
      { icon: "🚗", label: "Drive", name: "Badrinath to Rishikesh", time: "06:00 AM" },
      { icon: "🌉", label: "Bridge", name: "Lakshman Jhula Visit", time: "04:00 PM" },
      { icon: "🕉️", label: "Aarti", name: "Triveni Ghat Aarti", time: "06:30 PM" },
    ],
  },
  {
    day: 10,
    title: "Departure from Haridwar",
    date: "Day 10 - March 21",
    description: "Morning leisure time for shopping or temple visit. Check-out and drop to Haridwar railway station or airport.",
    activities: [
      { icon: "🛕", label: "Temple", name: "Morning Temple Visit", time: "06:00 AM" },
      { icon: "☕", label: "Breakfast", name: "Hotel Breakfast", time: "08:00 AM" },
      { icon: "✈️", label: "Departure", name: "Drop to Station/Airport", time: "11:00 AM" },
    ],
  },
];

export default function ItinerarySection() {
  // First 3 days expanded by default, others collapsed
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1, 2, 3]));

  const toggleDay = (dayNumber: number) => {
    setExpandedDays((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dayNumber)) {
        newSet.delete(dayNumber);
      } else {
        newSet.add(dayNumber);
      }
      return newSet;
    });
  };

  const isExpanded = (dayNumber: number) => expandedDays.has(dayNumber);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
      {/* Section Header */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Trip Itinerary – Day by Day Plan
        </h3>
        <p className="text-sm sm:text-base text-gray-600">
          Your spiritual journey through the Char Dham shrines
        </p>
      </div>

      {/* Timeline Container */}
      <div className="relative pl-10 sm:pl-12">
        {/* Vertical timeline line */}
        <div className="absolute top-3 left-4 sm:left-5 w-0.5 h-full bg-gradient-to-b from-orange-400 via-gray-200 to-transparent" />

        {itineraryData.map((day, index) => (
          <DayItem
            key={day.day}
            day={day}
            index={index}
            isExpanded={isExpanded(day.day)}
            onToggle={() => toggleDay(day.day)}
            isLast={index === itineraryData.length - 1}
          />
        ))}
      </div>

      {/* Important Note */}
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-5 h-5 text-amber-600 mt-0.5">⏱️</div>
          <div>
            <p className="text-sm font-medium text-amber-800 mb-1">Important Note</p>
            <p className="text-xs sm:text-sm text-amber-700 leading-relaxed">
              Final timings and sequence may change due to weather and temple schedules. 
              A detailed day-by-day plan will be shared after booking confirmation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Individual Day Component
function DayItem({
  day,
  index,
  isExpanded,
  onToggle,
  isLast,
}: {
  day: ItineraryDay;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  isLast: boolean;
}) {
  // Show at most 3 activities (or all if less)
  const displayActivities = day.activities?.slice(0, 3) || [];

  return (
    <div className="relative pb-6 sm:pb-8 last:pb-0">
      {/* Day Badge */}
      <div className="absolute -left-10 sm:-left-12 top-0 z-10">
        <button
          onClick={onToggle}
          className="group flex flex-col items-center gap-1"
          aria-label={isExpanded ? `Collapse Day ${day.day}` : `Expand Day ${day.day}`}
        >
          <div
            className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full text-sm sm:text-base font-bold shadow-md ring-4 ring-white transition-all duration-200 ${
              index === 0
                ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white"
                : isExpanded
                ? "bg-orange-500 text-white"
                : "bg-white border-2 border-orange-400 text-orange-600"
            }`}
          >
            {day.day}
          </div>
          <span className="text-[10px] sm:text-xs font-medium text-gray-500">Day</span>
        </button>
      </div>

      {/* Day Content */}
      <div className="pl-2 sm:pl-4">
        {/* Header - Always Visible */}
        <button
          onClick={onToggle}
          className="w-full text-left"
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h4 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                {day.title}
              </h4>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{day.date}</p>
            </div>
            <ChevronDownIcon
              className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Distance & Duration - Always Visible */}
          {(day.distance || day.duration) && (
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-500 mb-2">
              {day.distance && (
                <span className="flex items-center gap-1">
                  <MapPinIcon className="w-3.5 h-3.5" />
                  {day.distance}
                </span>
              )}
              {day.duration && (
                <span className="flex items-center gap-1">
                  <ClockIcon className="w-3.5 h-3.5" />
                  {day.duration}
                </span>
              )}
            </div>
          )}

          {/* Highlight Badge */}
          {day.isHighlight && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full mb-2">
              ⭐ Key Darshan Day
            </span>
          )}
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
            {/* Description */}
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {day.description}
            </p>

            {/* Activities */}
            {displayActivities.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Key Activities
                </h5>
                <div className="space-y-2">
                  {displayActivities.map((activity, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      {/* Time */}
                      <div className="w-14 sm:w-16 text-xs font-semibold text-orange-600 shrink-0 pt-0.5">
                        {activity.time}
                      </div>
                      {/* Activity Details */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-lg shadow-sm shrink-0">
                          {activity.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                            {activity.label}
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {activity.name}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {day.activities && day.activities.length > 3 && (
                  <p className="text-xs text-gray-400 text-center pt-1">
                    +{day.activities.length - 3} more activities
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Collapsed State - Show hint */}
        {!isExpanded && (
          <button
            onClick={onToggle}
            className="mt-2 text-xs font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            View details
            <ChevronDownIcon className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

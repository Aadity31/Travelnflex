"use client";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { ClockIcon, MapPinIcon } from "@heroicons/react/24/outline";

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

export default function ItinerarySection({
  showAllDays,
  setShowAllDays,
}: {
  showAllDays: boolean;
  setShowAllDays: (v: boolean) => void;
}) {
  // Complete dummy data for 10 days
  const allDays: ItineraryDay[] = [
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
      duration: "7-8 hours drive",
      activities: [
        { icon: "🚗", label: "Drive", name: "Haridwar to Janki Chatti", time: "06:00 AM" },
        { icon: "🥾", label: "Trek", name: "Yamunotri Temple Trek", time: "11:00 AM" },
        { icon: "♨️", label: "Hot Spring", name: "Surya Kund Dip", time: "12:30 PM" },
        { icon: "🍚", label: "Prasad", name: "Cook Rice in Hot Water", time: "01:00 PM" },
      ],
      isHighlight: true,
    },
    {
      day: 3,
      title: "Yamunotri to Uttarkashi",
      date: "Day 3 - March 14",
      description: "Trek back to Janki Chatti and drive to Uttarkashi. Visit Vishwanath Temple and explore local markets.",
      distance: "80 km from Yamunotri",
      duration: "3-4 hours drive",
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
      duration: "3-4 hours drive",
      activities: [
        { icon: "🛕", label: "Temple Visit", name: "Gangotri Temple", time: "06:00 AM" },
        { icon: "🥾", label: "Trek", name: "Gaumukh Glacier (Optional)", time: "08:00 AM" },
        { icon: "📸", label: "Photography", name: "Bhagirathi Peaks View", time: "12:00 PM" },
        { icon: "🌊", label: "River", name: "Ganga Origin Point", time: "02:00 PM" },
      ],
      isHighlight: true,
    },
    {
      day: 5,
      title: "Kedarnath Journey Begins",
      date: "Day 5 - March 16",
      description: "Drive to Gaurikund and begin trek to Kedarnath. Helicopter option available. Reach Kedarnath by evening.",
      distance: "30 km trek from Gaurikund",
      duration: "6-7 hours trek",
      activities: [
        { icon: "🚗", label: "Drive", name: "Uttarkashi to Gaurikund", time: "05:00 AM" },
        { icon: "🚁", label: "Transport", name: "Helicopter Service", time: "07:00 AM" },
        { icon: "🥾", label: "Trek", name: "Kedarnath Temple Trek", time: "08:00 AM" },
        { icon: "🛕", label: "Darshan", name: "Kedarnath Temple", time: "05:00 PM" },
      ],
    },
    {
      day: 6,
      title: "Kedarnath to Badrinath",
      date: "Day 6 - March 17",
      description: "Morning darshan at Kedarnath. Trek back and drive to Badrinath via Joshimath. Overnight stay at Badrinath.",
      distance: "220 km from Kedarnath",
      duration: "10-11 hours total",
      activities: [
        { icon: "🕉️", label: "Aarti", name: "Morning Aarti", time: "04:30 AM" },
        { icon: "🥾", label: "Trek", name: "Return to Gaurikund", time: "07:00 AM" },
        { icon: "🚗", label: "Drive", name: "Journey to Badrinath", time: "12:00 PM" },
        { icon: "🏨", label: "Check-in", name: "Hotel in Badrinath", time: "08:00 PM" },
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
        { icon: "🌊", label: "Waterfalls", name: "Vasudhara Falls Trek", time: "02:00 PM" },
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
        { icon: "🛍️", label: "Shopping", name: "Local Handicrafts", time: "04:00 PM" },
      ],
    },
    {
      day: 9,
      title: "Return Journey - Rishikesh",
      date: "Day 9 - March 20",
      description: "Start return journey to Rishikesh. Visit Lakshman Jhula, Ram Jhula, and attend evening Ganga Aarti at Triveni Ghat.",
      distance: "295 km from Badrinath",
      duration: "9-10 hours drive",
      activities: [
        { icon: "🚗", label: "Drive", name: "Badrinath to Rishikesh", time: "06:00 AM" },
        { icon: "🌉", label: "Bridge", name: "Lakshman Jhula Visit", time: "04:00 PM" },
        { icon: "🛕", label: "Temple", name: "Neelkanth Mahadev", time: "05:00 PM" },
        { icon: "🕉️", label: "Aarti", name: "Triveni Ghat Aarti", time: "06:30 PM" },
      ],
    },
    {
      day: 10,
      title: "Departure from Haridwar",
      date: "Day 10 - March 21",
      description: "Morning leisure time for shopping or temple visit. Check-out and drop to Haridwar railway station or airport. Safe journey ahead!",
      activities: [
        { icon: "🛕", label: "Temple", name: "Morning Temple Visit", time: "06:00 AM" },
        { icon: "☕", label: "Breakfast", name: "Hotel Breakfast", time: "08:00 AM" },
        { icon: "🛍️", label: "Shopping", name: "Souvenir Shopping", time: "09:00 AM" },
        { icon: "✈️", label: "Departure", name: "Drop to Station/Airport", time: "11:00 AM" },
      ],
    },
  ];

  // Show only 3 days initially
  const displayedDays = showAllDays ? allDays : allDays.slice(0, 3);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">
        Trip Itinerary - Day by Day Plan
      </h3>

      <div className="relative pl-10 sm:pl-12 space-y-8">
        {/* Vertical timeline line */}
        <div className="absolute top-4 left-4 sm:left-5 w-0.5 h-[calc(100%-32px)] bg-gradient-to-b from-orange-400 via-gray-200 to-gray-300"></div>

        {displayedDays.map((day, index) => (
          <div key={day.day} className="relative">
            {/* Day badge */}
            <div className="absolute -left-6 sm:-left-12 top-0 z-10">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold shadow-lg ring-4 ring-white transition-all ${
                    index === 0
                      ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white scale-110"
                      : "bg-white border-2 border-orange-400 text-orange-600"
                  }`}
                >
                  {day.day}
                </div>
              </div>
            </div>

            <div className="pl-2 sm:pl-4">
              {/* Header */}
              <div className="mb-3">
                <h4 className="text-lg font-bold text-gray-900 mb-1">
                  {day.title}
                </h4>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="text-gray-500 font-medium">{day.date}</span>
                  {day.distance && (
                    <span className="flex items-center gap-1 text-gray-500">
                      <MapPinIcon className="w-4 h-4" />
                      {day.distance}
                    </span>
                  )}
                  {day.duration && (
                    <span className="flex items-center gap-1 text-gray-500">
                      <ClockIcon className="w-4 h-4" />
                      {day.duration}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {day.description}
              </p>

              {/* Activities */}
              {day.activities && day.activities.length > 0 && (
                <div className="space-y-2 mb-4">
                  <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                    Activities & Sightseeing
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {day.activities.map((activity, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-2.5 bg-gradient-to-r from-gray-50 to-orange-50/30 hover:from-orange-50 hover:to-orange-100/50 rounded-lg border border-gray-200 hover:border-orange-300 transition-all"
                      >
                        <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-lg shadow-sm shrink-0">
                          {activity.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                            {activity.label}
                          </div>
                          <div className="text-sm font-semibold text-gray-900 truncate">
                            {activity.name}
                          </div>
                          {activity.time && (
                            <div className="text-xs text-orange-600 font-medium">
                              {activity.time}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Highlight */}
              {day.isHighlight && (
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border-2 border-orange-300 mb-4">
                  <div className="w-10 h-10 rounded-full bg-white text-orange-600 flex items-center justify-center text-xl shadow-md shrink-0">
                    ⭐
                  </div>
                  <div>
                    <div className="text-sm font-bold text-orange-800">
                      Special Highlight Day
                    </div>
                    <div className="text-xs text-orange-700">
                      Priority darshan & special arrangements included
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Show More/Less Button */}
        {allDays.length > 3 && (
          <div className="relative">
            <div className="absolute -left-6 sm:-left-7 top-0 z-10">
              <button
                onClick={() => setShowAllDays(!showAllDays)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-orange-100 text-gray-600 hover:text-orange-600 shadow-sm ring-4 ring-white transition-all"
              >
                {showAllDays ? (
                  <ChevronUpIcon className="w-5 h-5" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="pl-2 sm:pl-4">
              <button
                onClick={() => setShowAllDays(!showAllDays)}
                className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 hover:underline transition-colors"
              >
                {showAllDays ? (
                  <>Show Less <ChevronUpIcon className="w-4 h-4" /></>
                ) : (
                  <>View Remaining {allDays.length - 3} Days <ChevronDownIcon className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

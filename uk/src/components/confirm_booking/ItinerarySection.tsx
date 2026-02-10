"use client";

import { useEffect, useState } from "react";
import { ChevronDownIcon, ClockIcon, MapPinIcon } from "@heroicons/react/24/solid";

interface ActivityItem {
  icon?: string;
  label?: string;
  name: string;
  time?: string;
}

interface ItineraryDay {
  day: number;
  dayTitle?: string;
  title?: string;
  location?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  description: string;
  activities?: (string | ActivityItem)[];
  isHighlight?: boolean;
  distance?: string;
  duration?: string;
}

interface ItinerarySectionProps {
  itinerary: ItineraryDay[];
  showAllDays: boolean;
  setShowAllDays: (showAll: boolean) => void;
}

const INITIAL_VISIBLE_DAYS = 3;

export default function ItinerarySection({
  itinerary,
  showAllDays,
  setShowAllDays,
}: ItinerarySectionProps) {
  const [expandedDays, setExpandedDays] = useState<Set<number>>(
    () => new Set(itinerary.filter((d) => d.day <= 3).map((d) => d.day))
  );

  useEffect(() => {
    if (showAllDays) {
      setExpandedDays(new Set(itinerary.map((d) => d.day)));
    } else {
      setExpandedDays(new Set(itinerary.filter((d) => d.day <= 3).map((d) => d.day)));
    }
  }, [showAllDays, itinerary]);

  const toggleDay = (dayNumber: number) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(dayNumber)) {
        next.delete(dayNumber);
      } else {
        next.add(dayNumber);
      }
      const allDayNumbers = itinerary.map((d) => d.day);
      const allExpanded = allDayNumbers.every((d) => next.has(d));
      setShowAllDays(allExpanded);
      return next;
    });
  };

  const isExpanded = (dayNumber: number) => expandedDays.has(dayNumber);

  const visibleDays = showAllDays 
    ? itinerary 
    : itinerary.slice(0, INITIAL_VISIBLE_DAYS);

  const hasMoreDays = itinerary.length > INITIAL_VISIBLE_DAYS;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Trip Itinerary – Day by Day Plan
        </h3>
        <p className="text-sm sm:text-base text-gray-600">
          Your spiritual journey through the Char Dham shrines
        </p>
      </div>

      <div className="relative pl-10 sm:pl-12">
        <div className="absolute top-3 left-4 sm:left-5 w-0.5 h-full bg-gradient-to-b from-orange-400 via-gray-200 to-transparent" />

        {visibleDays.map((day, index) => (
          <DayItem
            key={day.day}
            day={day}
            index={index}
            isExpanded={isExpanded(day.day)}
            onToggle={() => toggleDay(day.day)}
            isLast={index === visibleDays.length - 1}
          />
        ))}
      </div>

      {hasMoreDays && (
        <div className="mt-6 flex justify-center">
          {!showAllDays ? (
            <button
              type="button"
              onClick={() => setShowAllDays(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              <span>View all {itinerary.length} days</span>
              <ChevronDownIcon className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowAllDays(false)}
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-orange-200 hover:bg-orange-50 text-orange-700 font-medium rounded-lg transition-colors"
            >
              <span>Show less</span>
              <ChevronDownIcon className="w-4 h-4 rotate-180" />
            </button>
          )}
        </div>
      )}

      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-5 h-5 text-amber-600 mt-0.5">⏱️</div>
          <div>
            <p className="text-sm font-medium text-amber-800 mb-1">Important Note</p>
            <p className="text-xs sm:text-sm text-amber-700 leading-relaxed">
              Final timings and sequence may change due to weather and temple schedules.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper to extract start/end time from activities
function getTimeRange(activities?: (string | ActivityItem)[]): { start?: string; end?: string } {
  if (!activities || activities.length === 0) return {};
  
  const times = activities
    .filter((a): a is ActivityItem => typeof a === 'object' && a !== null)
    .map(a => a.time)
    .filter(Boolean) as string[];
  
  if (times.length === 0) return {};
  
  return {
    start: times[0],
    end: times[times.length - 1]
  };
}

// Helper to get activity details
function getActivityDetails(activity: string | ActivityItem): { name: string; type?: string; time?: string } {
  if (typeof activity === 'string') {
    return { name: activity };
  }
  return {
    name: activity.name,
    type: activity.label,
    time: activity.time
  };
}

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
  const displayTitle = day.dayTitle || day.title || `Day ${day.day}`;
  const timeRange = getTimeRange(day.activities);
  
  // DEFAULT TIMES agar data mein nahi hai
  const finalStartTime = day.startTime || timeRange.start || "06:00 AM";
  const finalEndTime = day.endTime || timeRange.end || "08:00 PM";

  return (
    <div className={`relative pb-6 sm:pb-8 ${isLast ? "pb-0" : ""}`}>
      {/* Day Badge */}
      <div className="absolute -left-10 sm:-left-12 top-0 z-10">
        <button
          type="button"
          onClick={onToggle}
          className="group flex flex-col items-center gap-1"
          aria-expanded={isExpanded}
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

      <div className="pl-2 sm:pl-4">
        {/* Header - Always Visible */}
        <button type="button" onClick={onToggle} className="w-full text-left group">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h4 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                {displayTitle}
              </h4>
              <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm text-gray-500">
                {day.location && (
                  <>
                    
                    <MapPinIcon className="w-3.5 h-3.5 text-orange-500" />
                    <span className="text-orange-600 font-medium">{day.location}</span>
                  </>
                )}
                <span>•</span>
                <span>{day.date}</span>
                <span>•</span>
                <ClockIcon className="w-3.5 h-3.5" />
                <span>{finalStartTime} - {finalEndTime}</span>
                
              </div>
            </div>
            <ChevronDownIcon
              className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          </div>

          {day.isHighlight && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
              Key Darshan Day
            </span>
          )}
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 space-y-4">
           

            {/* Description / Notes */}
            {day.description && (
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase mb-1.5">
                  Description / Notes
                </div>
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-3 border border-gray-100">
                  {day.description}
                </p>
              </div>
            )}

            {/* Activities Section */}
            {day.activities && day.activities.length > 0 && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div className="text-xs font-semibold text-gray-500 uppercase">Activities</div>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-orange-700 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200">
                    <ClockIcon className="w-4 h-4" />
                    <span>{finalStartTime} to {finalEndTime}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {day.activities.map((activity, idx) => {
                    const details = getActivityDetails(activity);
                    return (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors"
                      >
                        {details.time && (
                          <div className="text-xs font-semibold text-orange-600 shrink-0 pt-0.5 w-16">
                            {details.time}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          {details.type && (
                            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-0.5">
                              {details.type}
                            </div>
                          )}
                          <div className="text-sm font-medium text-gray-900">
                            {details.name}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Distance & Duration */}
            {(day.distance || day.duration) && (
              <div className="flex flex-wrap gap-3 text-xs text-gray-500 pt-3 border-t border-gray-100">
                {day.distance && (
                  <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-full">
                    <MapPinIcon className="w-3.5 h-3.5" />
                    {day.distance}
                  </span>
                )}
                {day.duration && (
                  <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-full">
                    <ClockIcon className="w-3.5 h-3.5" />
                    {day.duration}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        
      </div>
    </div>
  );
}

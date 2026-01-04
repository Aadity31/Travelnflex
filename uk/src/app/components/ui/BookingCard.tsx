"use client";

import {
  CalendarIcon,
  HomeIcon,
  UserGroupIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid";
import {
  PACKAGE_CONFIG,
  BookingState,
  RoomLimits,
  PricingResult,
  PackageType,
} from "@/lib/bookingSection/booking";

interface CalendarProps {
  currentMonth: Date;
  daysInMonth: number;
  startingDayOfWeek: number;
  isDateAvailable: (day: number) => boolean;
  getDateString: (day: number) => string;
  goPrevMonth: () => void;
  goNextMonth: () => void;
}

interface BookingCardProps {
  booking: BookingState;
  roomLimits: RoomLimits;
  pricing: PricingResult;
  basePrice: number;
  calendar: CalendarProps;
  onPackageChange: (pkg: PackageType) => void;
  onAdultsChange: (delta: number) => void;
  onChildrenChange: (delta: number) => void;
  onRoomsChange: (delta: number) => void;
  onDateSelect: (dateStr: string) => void;
  onBookNow: () => void;
}

export function BookingCard({
  booking,
  roomLimits,
  pricing,
  basePrice,
  calendar,
  onPackageChange,
  onAdultsChange,
  onChildrenChange,
  onRoomsChange,
  onDateSelect,
  onBookNow,
}: BookingCardProps) {
  const {
    currentMonth,
    daysInMonth,
    startingDayOfWeek,
    isDateAvailable,
    getDateString,
    goPrevMonth,
    goNextMonth,
  } = calendar;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Price header */}
      <div className="bg-gradient-to-br from-orange-500 to-red-500 p-6 text-white">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-bold">₹{pricing.pricePerPerson}</span>
          <span className="text-white/80">per person</span>
        </div>
        {pricing.discount > 0 && (
          <div className="flex items-center gap-2">
            <span className="line-through text-white/60">₹{basePrice}</span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-sm font-semibold">
              Save ₹{pricing.discount}
            </span>
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Package selection */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3">
            Choose Package Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(PACKAGE_CONFIG) as PackageType[]).map((pkg) => (
              <button
                key={pkg}
                onClick={() => onPackageChange(pkg)}
                className={`p-3 rounded-xl border-2 transition-all text-left ${
                  booking.packageType === pkg
                    ? "border-orange-500 bg-orange-50 shadow-md"
                    : "border-gray-200 hover:border-orange-300"
                }`}
              >
                <div className="font-semibold text-sm text-gray-900 mb-1">
                  {PACKAGE_CONFIG[pkg].label}
                </div>
                <div className="text-xs text-gray-600">
                  {PACKAGE_CONFIG[pkg].description}
                </div>
                {PACKAGE_CONFIG[pkg].discount > 0 && (
                  <div className="mt-1 text-xs font-bold text-green-600">
                    {PACKAGE_CONFIG[pkg].discount * 100}% OFF
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Travellers */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3">
            <UserGroupIcon className="w-4 h-4 inline mr-1" />
            Travelers
          </label>

          {/* Adults */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700 font-medium">Adults</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onAdultsChange(-1)}
                  disabled={
                    booking.adults <=
                    PACKAGE_CONFIG[booking.packageType].minAdults
                  }
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-orange-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all"
                >
                  -
                </button>
                <span className="text-xl font-bold text-gray-900 w-8 text-center">
                  {booking.adults}
                </span>
                <button
                  onClick={() => onAdultsChange(1)}
                  disabled={
                    booking.adults + booking.children >=
                    PACKAGE_CONFIG[booking.packageType].maxAdults
                  }
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-orange-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Children */}
          {PACKAGE_CONFIG[booking.packageType].allowChildren && (
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-700 font-medium">
                    Children
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    (0-12 yrs, 50% price)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onChildrenChange(-1)}
                    disabled={booking.children <= 0}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-orange-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold text-gray-900 w-8 text-center">
                    {booking.children}
                  </span>
                  <button
                    onClick={() => onChildrenChange(1)}
                    disabled={
                      booking.adults + booking.children >=
                      PACKAGE_CONFIG[booking.packageType].maxAdults
                    }
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-orange-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rooms */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3">
            <HomeIcon className="w-4 h-4 inline mr-1" />
            Rooms
          </label>
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
            <button
              onClick={() => onRoomsChange(-1)}
              disabled={booking.rooms <= roomLimits.min}
              className="w-10 h-10 rounded-lg bg-white hover:bg-orange-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all shadow-sm"
            >
              -
            </button>
            <div className="flex-1 text-center">
              <div className="text-2xl font-bold text-gray-900">
                {booking.rooms}
              </div>
              <div className="text-xs text-gray-600">
                Min: {roomLimits.min} • Max: {roomLimits.max}
              </div>
            </div>
            <button
              onClick={() => onRoomsChange(1)}
              disabled={booking.rooms >= roomLimits.max}
              className="w-10 h-10 rounded-lg bg-white hover:bg-orange-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all shadow-sm"
            >
              +
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3">
            <CalendarIcon className="w-4 h-4 inline mr-1" />
            Select Available Date
          </label>

          <div className="flex items-center justify-between mb-3">
            <button
              onClick={goPrevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
            </button>
            <span className="font-semibold text-gray-900">
              {currentMonth.toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button
              onClick={goNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRightIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-3">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-gray-600 py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 42 }).map((_, index) => {
                const dayNumber = index - startingDayOfWeek + 1;
                const isCurrentMonth =
                  dayNumber > 0 && dayNumber <= daysInMonth;

                if (!isCurrentMonth) {
                  return <div key={index} className="aspect-square" />;
                }

                const dateStr = getDateString(dayNumber);
                const available = isDateAvailable(dayNumber);
                const selected = booking.selectedDate === dateStr;

                return (
                  <button
                    key={index}
                    onClick={() => available && onDateSelect(dateStr)}
                    disabled={!available}
                    className={`aspect-square rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      selected
                        ? "bg-orange-500 text-white"
                        : available
                        ? "bg-white hover:bg-orange-50 text-gray-900"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {dayNumber}
                  </button>
                );
              })}
            </div>
          </div>

          {booking.selectedDate && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-800 font-medium">
                  {new Date(booking.selectedDate).toLocaleDateString("en-IN", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="text-green-600 font-bold">
                  {booking.availableSlots} slots left
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Price breakdown */}
        <div className="p-4 bg-gradient-to-br from-gray-50 to-orange-50 rounded-xl space-y-2 border border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {booking.adults} Adult{booking.adults > 1 ? "s" : ""}
              {booking.children > 0 &&
                ` + ${booking.children} Child${
                  booking.children > 1 ? "ren" : ""
                }`}
            </span>
            <span className="font-semibold text-gray-900">
              ₹{pricing.peopleTotal}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {booking.rooms} Room{booking.rooms > 1 ? "s" : ""}
            </span>
            <span className="font-semibold text-gray-900">
              ₹{pricing.roomCost}
            </span>
          </div>
          {pricing.discount > 0 && (
            <div className="flex justify-between text-sm text-green-600 bg-green-50 px-2 py-1 rounded-lg">
              <span className="font-medium">Package Savings</span>
              <span className="font-bold">-₹{pricing.discount}</span>
            </div>
          )}
          <div className="pt-2 border-t-2 border-gray-300 flex justify-between items-center">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-2xl text-orange-600">
              ₹{pricing.total.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* CTA */}
        <button
          disabled={!booking.selectedDate}
          onClick={onBookNow}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {!booking.selectedDate
            ? "Select Date to Continue"
            : "Book Now - Pay Later"}
        </button>

        <div className="flex items-start gap-2 text-xs text-gray-500">
          <ShieldCheckIcon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
          <p>
            <strong className="text-gray-700">Free Cancellation</strong> •
            Reserve now, pay later. Cancel up to 24 hours before.
          </p>
        </div>
      </div>
    </div>
  );
}

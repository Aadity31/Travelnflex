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
import BookNowButton from "@/components/booking/BookNowButton";

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
  destination: string;
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
  destination,
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
  console.log("BookingCard rendered");
  console.log("onBookNow type:", typeof onBookNow);
  console.log("booking.selectedDate:", booking.selectedDate);
  console.log("Button will be disabled?", !booking.selectedDate);
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
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 p-4 text-white shadow-lg max-w-2xl">
        {/* subtle glow */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

        <div className="relative">
          {/* Price */}
          <div className="flex items-end gap-2">
            <span className="text-3xl font-extrabold tracking-tight">
              ₹{pricing.pricePerPerson}
            </span>
            <span className="text-xs text-white/80 mb-0.5">/ person</span>
          </div>

          {/* Discount */}
          {pricing.discount > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs line-through text-white/60">
                ₹{basePrice}
              </span>

              <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-xs font-bold text-orange-600 shadow-sm">
                🎉 Save ₹{pricing.discount}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Package Selection */}
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-700">
            Select Your Package
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Choose the package that best fits your needs
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-2xl">
            {(Object.keys(PACKAGE_CONFIG) as PackageType[]).map((pkg) => {
              const isActive = booking.packageType === pkg;

              return (
                <button
                  key={pkg}
                  onClick={() => onPackageChange(pkg)}
                  className={`group relative p-4 rounded-xl border-2 text-left transition-all duration-300 ease-out
            ${
              isActive
                ? "border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100/50 shadow-md ring-2 ring-orange-200 ring-opacity-50"
                : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm hover:bg-gray-50"
            }
          `}
                >
                  {/* Selection indicator */}
                  <div
                    className={`absolute top-3.5 right-3.5 flex items-center justify-center w-5 h-5 rounded-full transition-all duration-200
            ${
              isActive
                ? "bg-orange-500 scale-100"
                : "border-2 border-gray-300 bg-white scale-100"
            }
          `}
                  >
                    {isActive && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>

                  {/* Content */}
                  <div className="pr-8">
                    <h3 className="font-semibold text-sm text-gray-900 mb-1.5 leading-tight">
                      {PACKAGE_CONFIG[pkg].label}
                    </h3>

                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                      {PACKAGE_CONFIG[pkg].description}
                    </p>
                  </div>

                  {/* Discount badge */}
                  {PACKAGE_CONFIG[pkg].discount > 0 && (
                    <div className="mt-3 inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                      <span>Save {PACKAGE_CONFIG[pkg].discount * 100}%</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Travelers Section */}
        <div className="max-w-2xl space-y-1">
          <label className="block text-sm font-semibold text-gray-700">
            <UserGroupIcon className="w-4 h-4 inline mr-1.5 text-gray-500" />
            Number of Travelers
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Select how many people will be traveling
          </p>

          {/* Adults */}
          <div className="bg-white border border-gray-200 rounded-lg p-3 mb-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-900 font-medium">
                  Adults
                </span>
                <p className="text-xs text-gray-500 mt-0.5">Age 13 or above</p>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1.5">
                <button
                  onClick={() => onAdultsChange(-1)}
                  disabled={
                    booking.adults <=
                    PACKAGE_CONFIG[booking.packageType].minAdults
                  }
                  className="w-8 h-8 rounded-md bg-white border border-gray-200 hover:bg-orange-500 hover:border-orange-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed font-semibold transition-all shadow-sm flex items-center justify-center"
                >
                  −
                </button>
                <span className="text-base font-bold text-gray-900 w-6 text-center">
                  {booking.adults}
                </span>
                <button
                  onClick={() => onAdultsChange(1)}
                  disabled={
                    booking.adults + booking.children >=
                    PACKAGE_CONFIG[booking.packageType].maxAdults
                  }
                  className="w-8 h-8 rounded-md bg-white border border-gray-200 hover:bg-orange-500 hover:border-orange-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed font-semibold transition-all shadow-sm flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Children */}
          {PACKAGE_CONFIG[booking.packageType].allowChildren && (
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-900 font-medium">
                    Children
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Age 0-12 • 50% discount
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1.5">
                  <button
                    onClick={() => onChildrenChange(-1)}
                    disabled={booking.children <= 0}
                    className="w-8 h-8 rounded-md bg-white border border-gray-200 hover:bg-orange-500 hover:border-orange-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed font-semibold transition-all shadow-sm flex items-center justify-center"
                  >
                    −
                  </button>
                  <span className="text-base font-bold text-gray-900 w-6 text-center">
                    {booking.children}
                  </span>
                  <button
                    onClick={() => onChildrenChange(1)}
                    disabled={
                      booking.adults + booking.children >=
                      PACKAGE_CONFIG[booking.packageType].maxAdults
                    }
                    className="w-8 h-8 rounded-md bg-white border border-gray-200 hover:bg-orange-500 hover:border-orange-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed font-semibold transition-all shadow-sm flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rooms Section */}
        <div className="max-w-2xl space-y-1">
          <label className="block text-sm font-semibold text-gray-700">
            <HomeIcon className="w-4 h-4 inline mr-1.5 text-gray-500" />
            Room Selection
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Choose number of rooms required
          </p>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => onRoomsChange(-1)}
                disabled={booking.rooms <= roomLimits.min}
                className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 hover:bg-orange-500 hover:border-orange-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed font-semibold transition-all shadow-sm flex items-center justify-center text-lg"
              >
                −
              </button>
              <div className="text-center min-w-[80px]">
                <div className="text-2xl font-bold text-gray-900 mb-0.5">
                  {booking.rooms}
                </div>
                <div className="text-xs text-gray-500">
                  {booking.rooms === 1 ? "Room" : "Rooms"}
                </div>
              </div>
              <button
                onClick={() => onRoomsChange(1)}
                disabled={booking.rooms >= roomLimits.max}
                className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 hover:bg-orange-500 hover:border-orange-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed font-semibold transition-all shadow-sm flex items-center justify-center text-lg"
              >
                +
              </button>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 text-center text-xs text-gray-500">
              Available range: {roomLimits.min} - {roomLimits.max} rooms
            </div>
          </div>
        </div>

        {/* Calendar and Date Selection Section*/}

        <div className="max-w-2xl space-y-1">
          <label className="block text-sm font-semibold text-gray-700">
            <CalendarIcon className="w-4 h-4 inline mr-1.5 text-gray-500" />
            Select Travel Date
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Choose your preferred departure date
          </p>

          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <button
              onClick={goPrevMonth}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
            </button>
            <span className="font-semibold text-sm text-gray-900">
              {currentMonth.toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button
              onClick={goNextMonth}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Next month"
            >
              <ChevronRightIcon className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="bg-white border border-gray-200 rounded-lg p-3">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-gray-500 py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Date Cells */}
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
                    className={`aspect-square rounded-lg text-sm font-medium transition-all duration-200 ${
                      selected
                        ? "bg-orange-500 text-white shadow-sm ring-2 ring-orange-200 scale-105"
                        : available
                        ? "bg-white border border-gray-200 hover:border-orange-300 hover:bg-orange-50 text-gray-900"
                        : "bg-gray-50 text-gray-400 cursor-not-allowed"
                    }`}
                    aria-label={`${dayNumber} ${currentMonth.toLocaleDateString(
                      "en-IN",
                      { month: "long" }
                    )}`}
                  >
                    {dayNumber}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Date Confirmation */}
          {booking.selectedDate && (
            <div className="mt-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-900 font-medium">
                    {new Date(booking.selectedDate).toLocaleDateString(
                      "en-IN",
                      {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {booking.availableSlots} slots left
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="max-w-2xl space-y-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <svg
              className="w-4 h-4 inline mr-1.5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            Price Summary
          </label>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Line Items */}
            <div className="p-3 space-y-2.5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">
                  {booking.adults} Adult{booking.adults > 1 ? "s" : ""}
                  {booking.children > 0 &&
                    ` + ${booking.children} Child${
                      booking.children > 1 ? "ren" : ""
                    }`}
                </span>
                <span className="font-semibold text-gray-900">
                  ₹{pricing.peopleTotal.toLocaleString("en-IN")}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">
                  {booking.rooms} Room{booking.rooms > 1 ? "s" : ""}
                </span>
                <span className="font-semibold text-gray-900">
                  ₹{pricing.roomCost.toLocaleString("en-IN")}
                </span>
              </div>

              {pricing.discount > 0 && (
                <div className="flex justify-between items-center text-sm bg-green-50 border border-green-200 -mx-3 px-3 py-2">
                  <span className="text-green-700 font-medium flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                    Package Savings
                  </span>
                  <span className="text-green-700 font-bold">
                    -₹{pricing.discount.toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ₹{Math.round(pricing.total / 1.05).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 flex items-center gap-1.5">
                  GST (5%)
                  <svg
                    className="w-3.5 h-3.5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </span>
                <span className="font-semibold text-gray-900">
                  ₹
                  {Math.round(
                    pricing.total - pricing.total / 1.05
                  ).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Total Section */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 border-t-2 border-orange-200 px-3 py-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-bold text-gray-900">
                    Total Amount
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5">
                    GST included
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600">
                    ₹{pricing.total.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-2xl space-y-3">
          {booking.selectedDate && (
            <BookNowButton
              destination={destination}
              startDate={booking.selectedDate}
              endDate={booking.selectedDate}
              persons={booking.adults + booking.children}
              amount={pricing.total}
            />
          )}



          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-start gap-2 p-2.5 bg-green-50 border border-green-200 rounded-lg">
              <ShieldCheckIcon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-semibold text-green-900">
                  Free Cancellation
                </span>
                <p className="text-gray-600 mt-0.5">
                  Cancel up to 24 hours before departure
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
              <svg
                className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <div className="text-xs">
                <span className="font-semibold text-blue-900">
                  Secure Booking
                </span>
                <p className="text-gray-600 mt-0.5">
                  Your data is safe and encrypted
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2.5 bg-purple-50 border border-purple-200 rounded-lg">
              <svg
                className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-xs">
                <span className="font-semibold text-purple-900">
                  Best Price Guarantee
                </span>
                <p className="text-gray-600 mt-0.5">Lowest rates guaranteed</p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2.5 bg-orange-50 border border-orange-200 rounded-lg">
              <svg
                className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <div className="text-xs">
                <span className="font-semibold text-orange-900">
                  24/7 Support
                </span>
                <p className="text-gray-600 mt-0.5">
                  Round-the-clock assistance
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

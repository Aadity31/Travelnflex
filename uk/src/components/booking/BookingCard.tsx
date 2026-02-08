"use client";

import {
  Calendar,
  Home,
  Users,
  ChevronLeft,
  ChevronRight,
  Shield,
  CreditCard,
  Headphones,
  CheckCircle2,
  Minus,
  Plus,
  Star,
} from "lucide-react";
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
  isLoadingDates?: boolean;
  nextMonthWarning?: string | null;
}

interface BookingCardProps {
  booking: BookingState;
  destination: string;
  roomLimits: RoomLimits;
  pricing: PricingResult;
  basePrice: number;
  hotelPerPerson?: number;
  calendar: CalendarProps;
  onPackageChange: (pkg: PackageType) => void;
  onAdultsChange: (delta: number) => void;
  onChildrenChange: (delta: number) => void;
  onRoomsChange: (delta: number) => void;
  onDateSelect: (dateStr: string) => void;
  onBookNow?: () => void;
  discounts?: {
    soloTraveler?: { percentage: number; validUntil: string };
    familyPackage?: { percentage: number; validUntil: string };
    joinGroup?: { percentage: number; validUntil: string };
    ownGroup?: { percentage: number; validUntil: string };
  } | { percentage: number; validUntil: string };
}

// Helper to get discount for a package type
function getDiscountForPackage(
  pkg: PackageType,
  discounts?: BookingCardProps['discounts']
): number {
  if (!discounts) return 0;
  
  // Handle simple discount format (for activities)
  if ('percentage' in discounts && !('soloTraveler' in discounts)) {
    const { percentage, validUntil } = discounts as { percentage: number; validUntil: string };
    if (!percentage) return 0;
    
    const validUntilDate = new Date(validUntil);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (validUntilDate < today) return 0;
    
    return percentage / 100;
  }
  
  // Handle package-specific discount format (for destinations)
  const key = pkg === 'solo' ? 'soloTraveler'
    : pkg === 'family' ? 'familyPackage'
    : pkg === 'group' ? 'joinGroup'
    : 'ownGroup';
  
  const discount = (discounts as any)[key];
  if (!discount || !discount.percentage) return 0;
  
  // Check if discount is still valid
  const validUntilDate = new Date(discount.validUntil);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (validUntilDate < today) return 0;
  
  return discount.percentage / 100;
}

export function BookingCard({
  booking,
  destination,
  roomLimits,
  pricing,
  basePrice,
  hotelPerPerson,
  calendar,
  onPackageChange,
  onAdultsChange,
  onChildrenChange,
  onRoomsChange,
  onDateSelect,
  discounts,
}: BookingCardProps) {
  const {
    currentMonth,
    daysInMonth,
    startingDayOfWeek,
    isDateAvailable,
    getDateString,
    goPrevMonth,
    goNextMonth,
    nextMonthWarning,
  } = calendar;

  return (
    <div
      id="booking-card-scroll"
      className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
      role="region"
      aria-label="Booking Card"
    >
      {/* Price header */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-orange-500 via-orange-600 to-red-500 p-6 text-white shadow-lg">
        {/* subtle glow */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

        <div className="relative">
          {/* Price */}
          <div className="flex items-end gap-2">
            <span className="text-3xl font-extrabold tracking-tight">
              ₹{pricing.pricePerPerson}
            </span>
            <span className="text-sm text-white/80 mb-1">/ person</span>
          </div>

          {/* Discount */}
          {(pricing.originalPrice && pricing.originalPrice > pricing.pricePerPerson) && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm line-through text-white/60">
                ₹{pricing.originalPrice}
              </span>

              <span className="inline-flex items-center gap-1 rounded-md bg-white px-2.5 py-1 text-sm font-bold text-orange-600 shadow-sm">
                Save {pricing.discountPercentage || Math.round((pricing.originalPrice - pricing.pricePerPerson) / pricing.originalPrice * 100)}%
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Package Selection */}
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Select Package</h3>
            <p className="text-sm text-gray-500 mt-1">
              Choose the package that fits your needs
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {(Object.keys(PACKAGE_CONFIG) as PackageType[]).map((pkg) => {
              const isActive = booking.packageType === pkg;
              const config = PACKAGE_CONFIG[pkg];

              return (
                <button
                  key={pkg}
                  onClick={() => onPackageChange(pkg)}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                    isActive
                      ? "border-orange-500 bg-orange-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm"
                  }`}
                >
                  {/* Selection indicator */}
                  <div
                    className={`absolute top-3 right-3 flex items-center justify-center w-5 h-5 rounded-full ${
                      isActive ? "bg-orange-500" : "border-2 border-gray-300 bg-white"
                    }`}
                  >
                    {isActive && (
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    )}
                  </div>

                  <div className="pr-8">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {config.label}
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {config.description}
                    </p>
                  </div>

                  {/* Discount badge - use database discounts */}
                  {(() => {
                    const dbDiscount = getDiscountForPackage(pkg, discounts);
                    if (dbDiscount > 0) {
                      return (
                        <div className="mt-3 inline-flex items-center gap-1 rounded-lg bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                          Save {Math.round(dbDiscount * 100)}%
                        </div>
                      );
                    }
                    return null;
                  })()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Travelers Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-bold text-gray-900">Travelers</h3>
          </div>

          {/* Adults */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-gray-900">Adults</span>
                <p className="text-sm text-gray-500 mt-0.5">Age 13 or above</p>
              </div>
              <div className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 px-3 py-1.5">
                <button
                  onClick={() => onAdultsChange(-1)}
                  disabled={
                    booking.adults <= PACKAGE_CONFIG[booking.packageType].minAdults
                  }
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-orange-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed font-bold transition-all flex items-center justify-center"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold text-gray-900">
                  {booking.adults}
                </span>
                <button
                  onClick={() => onAdultsChange(1)}
                  disabled={
                    booking.adults + booking.children >=
                    PACKAGE_CONFIG[booking.packageType].maxAdults
                  }
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-orange-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed font-bold transition-all flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Children */}
          {PACKAGE_CONFIG[booking.packageType].allowChildren && (
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-900">Children</span>
                  <p className="text-sm text-gray-500 mt-0.5">Age 0-12</p>
                </div>
                <div className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 px-3 py-1.5">
                  <button
                    onClick={() => onChildrenChange(-1)}
                    disabled={booking.children <= 0}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-orange-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed font-bold transition-all flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-bold text-gray-900">
                    {booking.children}
                  </span>
                  <button
                    onClick={() => onChildrenChange(1)}
                    disabled={
                      booking.adults + booking.children >=
                      PACKAGE_CONFIG[booking.packageType].maxAdults
                    }
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-orange-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed font-bold transition-all flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rooms Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-bold text-gray-900">Rooms</h3>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => onRoomsChange(-1)}
                disabled={booking.rooms <= roomLimits.min}
                className="w-12 h-12 rounded-xl bg-white border border-gray-200 hover:bg-orange-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed font-bold transition-all flex items-center justify-center shadow-sm"
              >
                <Minus className="w-5 h-5" />
              </button>
              <div className="text-center min-w-[80px]">
                <div className="text-3xl font-bold text-gray-900">
                  {booking.rooms}
                </div>
                <div className="text-sm text-gray-500">
                  {booking.rooms === 1 ? "Room" : "Rooms"}
                </div>
              </div>
              <button
                onClick={() => onRoomsChange(1)}
                disabled={booking.rooms >= roomLimits.max}
                className="w-12 h-12 rounded-xl bg-white border border-gray-200 hover:bg-orange-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed font-bold transition-all flex items-center justify-center shadow-sm"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500 text-center mt-3">
              Available: {roomLimits.min} - {roomLimits.max} rooms
            </p>
          </div>
        </div>

        {/* Calendar and Date Selection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-bold text-gray-900">Select Date</h3>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            <button
              onClick={goPrevMonth}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="font-semibold text-gray-900">
              {currentMonth.toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button
              onClick={goNextMonth}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Next Month Warning */}
          {nextMonthWarning && (
            <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 text-center">
              {nextMonthWarning}
            </div>
          )}

          {/* Calendar Grid */}
          <div className="bg-gray-50 rounded-xl p-4">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-gray-500 py-2"
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
                    className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                      selected
                        ? "bg-orange-500 text-white shadow-md"
                        : available
                        ? "bg-white border border-gray-200 hover:border-orange-400 hover:bg-orange-50 text-gray-900"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {dayNumber}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Date Confirmation */}
          {booking.selectedDate ? (
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-medium text-green-800">
                  {new Date(booking.selectedDate).toLocaleDateString("en-IN", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-lg">
                {booking.availableSlots} slots left
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full" />
                <span className="font-medium text-amber-800">
                   select a date
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-bold text-gray-900">Price Summary</h3>
          </div>

          <div className="bg-gray-50 rounded-xl overflow-hidden">
            {/* Line Items */}
            <div className="p-4 space-y-2">
              {(booking.packageType === 'family' || booking.packageType === 'private') ? (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Package Price</span>
                  <span className="font-semibold text-gray-900">
                    ₹{pricing.peopleTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              ) : (
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
              )}

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">
                  {booking.rooms} Room{booking.rooms > 1 ? "s" : ""}
                  {hotelPerPerson ? ` @ ₹${hotelPerPerson}/room` : ""}
                </span>
                <span className="font-semibold text-gray-900">
                  ₹{pricing.roomCost.toLocaleString("en-IN")}
                </span>
              </div>

              {pricing.discount > 0 && (
                <div className="flex justify-between items-center text-sm text-green-600">
                  <span className="font-medium">Package Savings</span>
                  <span className="font-bold">-₹{pricing.discount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-gray-900">Total Amount</span>
                  <span className="font-bold text-gray-900">
                    ₹{pricing.total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </div>

            {/* Total Section */}
            <div className="bg-orange-50 border-t border-orange-200 px-4 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-gray-900">Total Amount</div>
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

        {/* CTA Section - Always Visible */}
        <div className="pt-2">
          <BookNowButton
            destination={destination}
            startDate={booking.selectedDate || new Date().toISOString().split('T')[0]}
            endDate={booking.selectedDate || new Date().toISOString().split('T')[0]}
            persons={booking.adults + booking.children}
            amount={pricing.total}
            disabled={!booking.selectedDate}
          />
        </div>

        {/* Mobile Sticky Book Now Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg px-4 py-3 safe-area-pb">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Total</span>
              <span className="text-lg font-bold text-gray-900">
                ₹{pricing.total.toLocaleString("en-IN")}
              </span>
            </div>
            <button
              onClick={() => {
                if (!booking.selectedDate) {
                  return;
                }
                const el = document.getElementById("booking-card-scroll");
                el?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              className={`py-3 px-6 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                !booking.selectedDate
                  ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                  : "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
              }`}
            >
              {!booking.selectedDate ? "Select Date" : "Book Now"}
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
            <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-green-800 block">
                Free Cancellation
              </span>
              <span className="text-green-600">Up to 24 hours before</span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-blue-800 block">
                Secure Booking
              </span>
              <span className="text-blue-600">Your data is safe</span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-purple-50 border border-purple-200 rounded-xl">
            <Star className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-purple-800 block">
                Best Price
              </span>
              <span className="text-purple-600">Lowest rates guaranteed</span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-orange-50 border border-orange-200 rounded-xl">
            <Headphones className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-orange-800 block">
                24/7 Support
              </span>
              <span className="text-orange-600">Round-the-clock help</span>
            </div>
          </div>
        </div>

        {/* Terms */}
        <p className="text-xs text-gray-500 text-center mt-4">
          By booking, you agree to our{" "}
          <a
            href="/terms-and-conditions"
            className="text-orange-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms & Conditions
          </a>{" "}and{" "}
          <a
            href="/privacy-policy"
            className="text-orange-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}

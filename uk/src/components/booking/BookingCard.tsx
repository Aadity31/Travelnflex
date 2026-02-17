"use client";

import { useEffect, useState, useRef } from "react";

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
import { TrustBadges } from "./TrustBadges";

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

// ============================================
// SECURITY UTILITIES - Input Validation & Sanitization
// ============================================

/**
 * Sanitize string input to prevent XSS attacks
 * Removes potentially dangerous characters
 */
function sanitizeString(input: string, maxLength: number = 100): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/[<>'"&\\]/g, "")
    .replace(/[\x00-\x1f\x7f]/g, "")
    .trim()
    .slice(0, maxLength);
}

/**
 * Validate and sanitize numeric input
 * Ensures value is within acceptable bounds
 */
function sanitizeNumber(value: unknown, min: number, max: number, defaultValue: number): number {
  const num = Number(value);
  if (!Number.isFinite(num) || Number.isNaN(num)) return defaultValue;
  return Math.max(min, Math.min(max, Math.round(num)));
}

/**
 * Validate date string format (YYYY-MM-DD)
 */
function isValidDateString(dateStr: string): boolean {
  if (typeof dateStr !== "string") return false;
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const date = new Date(dateStr);
  return date instanceof Date && !Number.isNaN(date.getTime());
}

/**
 * Validate package type
 */
function isValidPackageType(value: unknown): value is PackageType {
  if (typeof value !== "string") return false;
  return ["solo", "family", "private", "group"].includes(value);
}

function _secureHandler<T extends (...args: T[]) => void>(
  handler: T
): T {
  return ((...args: Parameters<T>) => {
    try {
      handler(...args);
    } catch (error) {
      console.error("[SECURITY_ERROR] Handler execution blocked:", error);
    }
  }) as T;
}

/**
 * Secure delta handler for numeric values (adults/children/rooms)
 * Returns a proper React event handler
 */
function createSecureDeltaHandler(
  onChange: (delta: number) => void,
  minDelay: number = 300
) {
  let lastCall = 0;
  return (event: React.MouseEvent) => {
    event.preventDefault();
    const delta = Number((event.target as HTMLButtonElement).value) || 0;
    const now = Date.now();
    if (now - lastCall >= minDelay) {
      lastCall = now;
      const sanitized = sanitizeNumber(delta, -100, 100, 0);
      onChange(sanitized);
    }
  };
}

/**
 * Secure date selection handler
 * Returns a proper React event handler
 */
function _createSecureDateHandler(onDateSelect: (dateStr: string) => void) {
  return (event: React.MouseEvent) => {
    event.preventDefault();
    const target = event.target as HTMLButtonElement;
    const dateStr = target.textContent?.trim() || "";
    try {
      const sanitized = sanitizeString(dateStr, 10);
      if (isValidDateString(sanitized)) {
        onDateSelect(sanitized);
      }
    } catch {
      // Silently handled
    }
  };
}

/**
 * Rate limiter for client-side actions
 * Prevents rapid-fire requests
 */
function createRateLimiter(maxRequests: number, windowMs: number) {
  const requests: number[] = [];
  return {
    check: (): boolean => {
      const now = Date.now();
      const windowStart = now - windowMs;
      const recentRequests = requests.filter(t => t > windowStart);
      if (recentRequests.length >= maxRequests) {
        return false;
      }
      requests.push(now);
      return true;
    },
    reset: () => { requests.length = 0; }
  };
}

// Rate limiter - available for future rate limiting
const _bookingRateLimiter = createRateLimiter(5, 10000);

// ============================================
// PRICE INTEGRITY VALIDATION
// ============================================

/**
 * Validate price data integrity
 * This runs on the server in production - this is a client-side fallback
 * Only checks for extreme values that indicate clear tampering
 */
function validatePriceIntegrity(
  basePrice: number,
  pricing: PricingResult,
  adults: number,
  children: number
): { valid: boolean; warning?: string } {
  // Check for obviously manipulated extreme values
  // These thresholds catch clear tampering, not normal usage
  if (basePrice <= 0 || basePrice > 10000000) {
    return { valid: false, warning: "Invalid base price detected" };
  }

  if (pricing.total < 0 || pricing.total > 10000000) {
    return { valid: false, warning: "Invalid total price detected" };
  }

  // Only check for clearly impossible values
  // Package switching causes normal price changes - no false positives
  if (pricing.pricePerPerson <= 0 && basePrice > 0) {
    return { valid: false, warning: "Invalid price per person" };
  }

  if (pricing.peopleTotal <= 0 && adults + children > 0) {
    return { valid: false, warning: "Invalid people total" };
  }

  // All checks passed - pricing is within acceptable bounds
  // NOTE: Server-side validation will verify actual pricing before payment
  return { valid: true };
}

// ============================================
// DISCOUNT VALIDATION
// ============================================

/**
 * Validate discount data from server
 * Prevents client-side discount manipulation
 */
function validateDiscount(
  discount: { percentage: number; validUntil: string } | undefined
): { valid: boolean; percentage: number; error?: string } {
  if (!discount) {
    return { valid: true, percentage: 0 };
  }

  // Validate percentage bounds
  if (typeof discount.percentage !== "number" || 
      discount.percentage < 0 || 
      discount.percentage > 100) {
    return { valid: false, percentage: 0, error: "Invalid discount percentage" };
  }

  // Validate expiration date format
  if (!isValidDateString(discount.validUntil)) {
    return { valid: false, percentage: 0, error: "Invalid discount expiration" };
  }

  // Check if discount has expired
  const validUntil = new Date(discount.validUntil);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  if (validUntil < now) {
    return { valid: false, percentage: 0, error: "Discount has expired" };
  }

  return { valid: true, percentage: discount.percentage };
}

// ============================================
// DISCOUNT HELPER (Legacy - still used in UI)
// ============================================

/**
 * Get discount for a package type (client-side reference only)
 * Server must validate final pricing before payment
 */
function getDiscountForPackage(
  pkg: PackageType,
  discounts?: BookingCardProps['discounts']
): number {
  if (!discounts) return 0;
  
  // Handle simple discount format (for activities)
  if ('percentage' in discounts && !('soloTraveler' in discounts)) {
    const { percentage, validUntil } = discounts as { percentage: number; validUntil: string };
    const validation = validateDiscount({ percentage, validUntil });
    if (!validation.valid) return 0;
    return validation.percentage / 100;
  }
  
  // Handle package-specific discount format (for destinations)
  const key = pkg === 'solo' ? 'soloTraveler'
    : pkg === 'family' ? 'familyPackage'
    : pkg === 'group' ? 'joinGroup'
    : 'ownGroup';
  
  const discount = (discounts as Record<string, { percentage: number; validUntil: string } | undefined>)[key];
  if (!discount) return 0;
  
  const validation = validateDiscount(discount);
  if (!validation.valid) return 0;
  
  return validation.percentage / 100;
}

// ============================================
// PROPS INTERFACES
// ============================================

export function BookingCard({
  booking,
  destination,
  roomLimits,
  pricing,
  basePrice: _basePrice,
  hotelPerPerson,
  calendar,
  onPackageChange,
  onAdultsChange,
  onChildrenChange,
  onRoomsChange,
  onDateSelect,
  discounts,
}: BookingCardProps) {
  // Unused state variables - available for future rate limiting features
  const [tamperWarning, setTamperWarning] = useState<string | null>(null);
  // isRateLimited is available for future rate limiting implementation
  const isRateLimited = false;
  const lastActionRef = useRef<number>(0);

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

  // Validate pricing integrity on mount and when dependencies change
  useEffect(() => {
    const integrity = validatePriceIntegrity(
      _basePrice,
      pricing,
      booking.adults,
      booking.children
    );

    if (!integrity.valid && integrity.warning) {
      setTamperWarning(integrity.warning);
      // Auto-hide warning after 5 seconds
      setTimeout(() => setTamperWarning(null), 5000);
    }
  }, [_basePrice, pricing, booking.packageType, booking.adults, booking.children, booking.rooms, hotelPerPerson]);

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

      {/* Security Warning Banner - Tamper Detection */}
      {tamperWarning && (
        <div 
          className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-800">Security Alert</h4>
              <p className="text-sm text-red-700 mt-1">{tamperWarning}</p>
              <p className="text-xs text-red-600 mt-2">
                Final pricing will be verified by the server before payment.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Rate Limiting Warning */}
      {isRateLimited && (
        <div 
          className="mx-6 mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl"
          role="alert"
        >
          <p className="text-sm text-amber-800">
            Too many requests. Please wait a moment before trying again.
          </p>
        </div>
      )}

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
                  onClick={() => {
                    if (isValidPackageType(pkg)) {
                      // Rate limit package changes
                      const now = Date.now();
                      if (now - lastActionRef.current < 500) return; // 500ms debounce
                      lastActionRef.current = now;
                      onPackageChange(pkg);
                    }
                  }}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                    isActive
                      ? "border-orange-500 bg-orange-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm"
                  }`}
                  aria-pressed={isActive}
                  aria-label={`Select ${config.label} package`}
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
                  onClick={createSecureDeltaHandler(onAdultsChange)}
                  value={-1}
                  disabled={
                    booking.adults <= PACKAGE_CONFIG[booking.packageType].minAdults
                  }
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-orange-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed font-bold transition-all flex items-center justify-center"
                  aria-label="Decrease adult count"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold text-gray-900">
                  {booking.adults}
                </span>
                <button
                  onClick={createSecureDeltaHandler(onAdultsChange)}
                  value={1}
                  disabled={
                    booking.adults + booking.children >=
                    PACKAGE_CONFIG[booking.packageType].maxAdults
                  }
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-orange-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed font-bold transition-all flex items-center justify-center"
                  aria-label="Increase adult count"
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
                    onClick={createSecureDeltaHandler(onChildrenChange)}
                    value={-1}
                    disabled={booking.children <= 0}
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-orange-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed font-bold transition-all flex items-center justify-center"
                    aria-label="Decrease children count"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-bold text-gray-900">
                    {booking.children}
                  </span>
                  <button
                    onClick={createSecureDeltaHandler(onChildrenChange)}
                    value={1}
                    disabled={
                      booking.adults + booking.children >=
                      PACKAGE_CONFIG[booking.packageType].maxAdults
                    }
                    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-orange-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed font-bold transition-all flex items-center justify-center"
                    aria-label="Increase children count"
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
              value={-1}
              onClick={createSecureDeltaHandler(onRoomsChange)}
              disabled={booking.rooms <= roomLimits.min}
              className="w-12 h-12 rounded-xl bg-white border border-gray-200 hover:bg-orange-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed font-bold transition-all flex items-center justify-center shadow-sm"
              aria-label="Decrease room count"
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
                value={1}
                onClick={createSecureDeltaHandler(onRoomsChange)}
                disabled={booking.rooms >= roomLimits.max}
                className="w-12 h-12 rounded-xl bg-white border border-gray-200 hover:bg-orange-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed font-bold transition-all flex items-center justify-center shadow-sm"
                aria-label="Increase room count"
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
                    onClick={(_e) => {
                      if (available && dateStr) {
                        const sanitized = sanitizeString(dateStr, 10);
                        if (isValidDateString(sanitized)) {
                          onDateSelect(sanitized);
                        }
                      }
                    }}
                    disabled={!available}
                    className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                      selected
                        ? "bg-orange-500 text-white shadow-md"
                        : available
                        ? "bg-white border border-gray-200 hover:border-orange-400 hover:bg-orange-50 text-gray-900"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                    aria-label={`Select date ${dayNumber}`}
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
            {/* Price Breakdown Header */}
            <div className="px-4 py-3 bg-gray-100 border-b border-gray-200">
              <h4 className="font-bold text-gray-900">Price Breakdown</h4>
            </div>
            
            {/* Line Items - Show original prices */}
            <div className="p-4 space-y-3">
              {/* Adults - Original price (before discount) */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">
                  {booking.adults} Adult
                </span>
                <span className="font-semibold text-gray-900">
                  ₹{((pricing.originalPrice || pricing.pricePerPerson) * booking.adults).toLocaleString("en-IN")}
                </span>
              </div>

              {/* Children - Original price (before discount) */}
              {booking.children > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">
                    {booking.children} Child
                  </span>
                  <span className="font-semibold text-gray-900">
                    ₹{((pricing.originalPrice || pricing.pricePerPerson) * booking.children * 0.5).toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              {/* Rooms */}
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-1 group relative cursor-help">
                  <span className="text-gray-600">
                    Hotel Expense
                  </span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    <path strokeLinecap="round" strokeWidth="2" d="M12 16v-4M12 8h.01" />
                  </svg>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    This is total trip hotel expense for {booking.adults} {booking.adults > 1 ? 'people' : 'person'}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                  </div>
                </div>
                <span className="font-semibold text-gray-900">
                  ₹{(pricing.roomCost).toLocaleString("en-IN")}
                </span>
              </div>

              {/* Subtotal - Original prices sum */}
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700">Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ₹{(((pricing.originalPrice || pricing.pricePerPerson) * (booking.adults + booking.children * 0.5)) + pricing.roomCost).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {/* Discount */}
              {pricing.discount > 0 && (
                <div className="flex justify-between items-center text-sm text-green-600">
                  <span className="font-medium">Discount ({pricing.discountPercentage}%)</span>
                  <span className="font-bold">-₹{pricing.discount.toLocaleString("en-IN")}</span>
                </div>
              )}
            </div>

            {/* Total Section */}
            <div className="bg-orange-50 border-t border-orange-200 px-4 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-bold text-gray-900">Total Amount</div>
                  <div className="text-xs text-gray-500">All inclusive</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-orange-600">
                    ₹{pricing.total.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-2 pt-2 border-t border-gray-200">
             
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
            packageType={booking.packageType}
            rooms={booking.rooms}
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
                  ? "bg-linear-to-r from-gray-400 to-gray-500 text-white"
                  : "bg-linear-to-r from-orange-500 to-red-500 text-white shadow-lg"
              }`}
            >
              {!booking.selectedDate ? "Select Date" : "Book Now"}
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <TrustBadges />

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

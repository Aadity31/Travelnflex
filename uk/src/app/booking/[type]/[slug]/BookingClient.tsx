// app/booking/[type]/[slug]/BookingClient.tsx

"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  StarIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  SparklesIcon,
  ShieldCheckIcon,
  BoltIcon,
} from "@heroicons/react/24/solid";

import {
  PACKAGE_CONFIG,
  getRoomLimits,
  calculatePricing,
  getAvailableDates,
  BookingState,
  PackageType,
} from "@/lib/bookingSection/booking";

import {
  Review,
  getAverageRating,
  getRatingDistribution,
} from "@/lib/bookingSection/reviews";

import {
  RecommendedCard,
  dummyRecommendedItems,
} from "@/app/components/ui/RecommendedCard";

import { BookingGallery } from "@/app/components/ui/BookingGallery";
import { BookingCard } from "@/app/components/ui/BookingCard";

interface Agency {
  name: string;
  logo?: string;
  description?: string;
}

interface UnifiedData {
  id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  location: string;
  rating: number;
  reviewCount: number;
  duration?: string;
  images: string[];
  highlights?: string[];
  includes?: string[];
  popularActivities?: string[];
  bestTimeToVisit?: string;
  type?: string;
  difficulty?: string;
  priceMin: number;
  priceMax: number;
  currency?: string;
  agency?: Agency;
}

interface BookingClientProps {
  data: UnifiedData;
  reviews: Review[];
  type: "activity" | "destination";
}

/* ============ COMPONENT ============ */

export default function BookingClient({
  data,
  reviews,
  type,
}: BookingClientProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [booking, setBooking] = useState<BookingState>({
    packageType: "solo",
    adults: 1,
    children: 0,
    rooms: 1,
    selectedDate: null,
    availableSlots: 0,
  });

  const availableDates = useMemo(() => getAvailableDates(), []);

  /* ============ CORRECTED ROOM LOGIC ============ */

  const roomLimits = useMemo(
    () => getRoomLimits(booking.adults, booking.children, booking.packageType),
    [booking.adults, booking.children, booking.packageType]
  );

  // Auto-adjust rooms when limits change
  useEffect(() => {
    setBooking((prev) => ({
      ...prev,
      rooms: Math.max(roomLimits.min, Math.min(prev.rooms, roomLimits.max)),
    }));
  }, [roomLimits.min, roomLimits.max]);

  const pricing = useMemo(
    () => calculatePricing(booking, data.priceMin),
    [booking, data.priceMin]
  );

  const averageRating = getAverageRating(reviews, data.rating);
  const ratingDistribution = getRatingDistribution(reviews);

  /* ============ HANDLERS ============ */

  const handlePackageChange = useCallback((pkg: PackageType) => {
    const config = PACKAGE_CONFIG[pkg];
    setBooking({
      packageType: pkg,
      adults: config.minAdults,
      children: 0,
      rooms: 1,
      selectedDate: null,
      availableSlots: 0,
    });
  }, []);

  const handleDateSelect = useCallback(
    (dateStr: string) => {
      const slots = availableDates[dateStr] || 0;
      setBooking((prev) => ({
        ...prev,
        selectedDate: dateStr,
        availableSlots: slots,
      }));
    },
    [availableDates]
  );

  const goPrevMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() - 1);
    if (newMonth >= new Date()) {
      setCurrentMonth(newMonth);
    }
  };

  const goNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  const handleAdultsChange = (delta: number) => {
    setBooking((prev) => {
      const config = PACKAGE_CONFIG[prev.packageType];
      const nextAdults = Math.max(
        config.minAdults,
        Math.min(config.maxAdults - prev.children, prev.adults + delta)
      );
      return { ...prev, adults: nextAdults };
    });
  };

  const handleChildrenChange = (delta: number) => {
    setBooking((prev) => {
      const config = PACKAGE_CONFIG[prev.packageType];
      const nextChildren = Math.max(
        0,
        Math.min(config.maxAdults - prev.adults, prev.children + delta)
      );
      return { ...prev, children: nextChildren };
    });
  };

  const handleRoomsChange = (delta: number) => {
    setBooking((prev) => ({
      ...prev,
      rooms: Math.max(
        roomLimits.min,
        Math.min(roomLimits.max, prev.rooms + delta)
      ),
    }));
  };

  /* ============ CALENDAR LOGIC ============ */

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);

  const isDateAvailable = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split("T")[0];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return date >= today && availableDates[dateStr] > 0;
  };

  const getDateString = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const date = new Date(year, month, day);
    return date.toISOString().split("T")[0];
  };

  /* ============ SAFE DATA ACCESS ============ */

  const displayData = {
    description:
      data.description ||
      data.shortDescription ||
      "Experience the best of India with our carefully curated tours.",
    images:
      data.images && data.images.length > 0
        ? data.images
        : ["/placeholder-image.jpg"],
    highlights:
      type === "activity"
        ? data.includes || data.highlights || []
        : data.highlights || data.popularActivities || [],
    agency: data.agency || {
      name:
        type === "activity" ? "Adventure Tours India" : "Sacred Journeys India",
      logo: "/agency-logo.png",
      description: "Professional tour operator with years of experience.",
    },
  };

  /* ============ RENDER ============ */

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white mt-12">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ============ LEFT COLUMN ============ */}
          <div className="lg:col-span-8 space-y-6">
            {/* IMAGE GALLERY */}
            <BookingGallery
              images={displayData.images}
              name={data.name}
              type={type}
              activityType={data.type}
              rating={data.rating}
              reviewCount={data.reviewCount}
            />

            {/* Title & Info */}
            <section className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                {data.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1.5">
                  <MapPinIcon className="w-4 h-4 text-orange-500" />
                  <span className="font-medium">{data.location}</span>
                </div>

                {data.duration && (
                  <div className="flex items-center gap-1.5">
                    <ClockIcon className="w-4 h-4 text-blue-500" />
                    <span>{data.duration}</span>
                  </div>
                )}

                {data.bestTimeToVisit && (
                  <div className="flex items-center gap-1.5">
                    <SparklesIcon className="w-4 h-4 text-purple-500" />
                    <span>Best: {data.bestTimeToVisit}</span>
                  </div>
                )}

                {data.difficulty && (
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold capitalize">
                    {data.difficulty}
                  </span>
                )}
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-1.5 text-sm text-green-700 bg-green-50 px-3 py-1.5 rounded-lg">
                  <ShieldCheckIcon className="w-4 h-4" />
                  <span className="font-medium">Verified Operator</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">
                  <BoltIcon className="w-4 h-4" />
                  <span className="font-medium">Instant Confirmation</span>
                </div>
              </div>
            </section>

            {/* Description */}
            <section className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                About This Experience
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {displayData.description}
              </p>
            </section>

            {/* Highlights */}
            {displayData.highlights.length > 0 && (
              <section className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {type === "activity" ? "What's Included" : "Highlights"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {displayData.highlights.map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Agency */}
            <section className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl shadow-sm p-4 sm:p-6 border border-orange-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Hosted By
              </h2>
              <div className="flex items-start gap-4">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-orange-500 to-red-500 shadow-lg">
                  <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                    {displayData.agency.name.charAt(0)}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {displayData.agency.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                    <ShieldCheckIcon className="w-4 h-4 text-green-600" />
                    Verified tour operator • 500+ tours completed
                  </p>
                  <p className="text-gray-700 text-sm">
                    {displayData.agency.description}
                  </p>
                </div>
              </div>
            </section>

            {/* Recommended Activities */}
            {dummyRecommendedItems.length > 0 && (
              <section className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 mt-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                  Recommended Activities
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dummyRecommendedItems.map((item) => (
                    <RecommendedCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            )}

            {/* MOBILE BOOKING CARD */}
            <div className="lg:hidden">
              <BookingCard
                booking={booking}
                roomLimits={roomLimits}
                pricing={pricing}
                basePrice={data.priceMin}
                calendar={{
                  currentMonth,
                  daysInMonth,
                  startingDayOfWeek,
                  isDateAvailable,
                  getDateString,
                  goPrevMonth,
                  goNextMonth,
                }}
                onPackageChange={handlePackageChange}
                onAdultsChange={handleAdultsChange}
                onChildrenChange={handleChildrenChange}
                onRoomsChange={handleRoomsChange}
                onDateSelect={handleDateSelect}
                onBookNow={() => {
                  // TODO: your submit / navigation
                }}
              />
            </div>

            {/* Reviews */}
            <section className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Customer Reviews
              </h2>

              {/* Rating Overview */}
              <div className="flex flex-col md:flex-row gap-6 mb-8 pb-8 border-b border-gray-200">
                <div className="text-center md:text-left bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6">
                  <div className="text-5xl font-bold text-gray-900 mb-2">
                    {averageRating}
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(parseFloat(averageRating))
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    {reviews.length || data.reviewCount} reviews
                  </p>
                </div>

                {/* Rating Bars */}
                <div className="flex-1 space-y-3">
                  {[5, 4, 3, 2, 1].map((rating, idx) => {
                    const count = ratingDistribution[idx];
                    const totalReviews = reviews.length || 1;
                    const percentage = (count / totalReviews) * 100;
                    return (
                      <div key={rating} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 w-14 font-medium">
                          {rating} star
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right font-medium">
                          {Math.round(percentage)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.slice(0, 5).map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md">
                          {review.userName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">
                              {review.userName}
                            </h4>
                            <span className="text-sm text-gray-500">•</span>
                            <span className="text-sm text-gray-500">
                              {new Date(review.date).toLocaleDateString(
                                "en-IN",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-gray-700 leading-relaxed">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className="w-10 h-10 text-gray-300" />
                      ))}
                    </div>
                    <p className="text-gray-500 font-medium mb-2">
                      No reviews yet
                    </p>
                    <p className="text-sm text-gray-400">
                      Be the first to share your experience!
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* ============ DESKTOP BOOKING CARD (STICKY) ============ */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-6">
              <BookingCard
                booking={booking}
                roomLimits={roomLimits}
                pricing={pricing}
                basePrice={data.priceMin}
                calendar={{
                  currentMonth,
                  daysInMonth,
                  startingDayOfWeek,
                  isDateAvailable,
                  getDateString,
                  goPrevMonth,
                  goNextMonth,
                }}
                onPackageChange={handlePackageChange}
                onAdultsChange={handleAdultsChange}
                onChildrenChange={handleChildrenChange}
                onRoomsChange={handleRoomsChange}
                onDateSelect={handleDateSelect}
                onBookNow={() => {
                  // TODO: your submit / navigation
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

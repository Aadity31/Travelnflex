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
  ChevronLeftIcon,
  ChevronRightIcon,
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
import { useRouter } from "next/navigation";

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

  const router = useRouter();

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

  /* ============ REVIEWS SECTION ============ */

  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 5;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  /* ============  BOOK NOW SECTION ============ */

 const handleBookNow = () => {
  // Validate that date is selected
  if (!booking.selectedDate) return;

  // Create URL with booking data as query parameters
  const params = new URLSearchParams({
    selectedDate: booking.selectedDate,
    adults: booking.adults.toString(),
    children: booking.children.toString(),
    rooms: booking.rooms.toString(),
    packageType: booking.packageType,
    availableSlots: booking.availableSlots.toString(),
    peopleTotal: pricing.peopleTotal.toString(),
    roomCost: pricing.roomCost.toString(),
    discount: pricing.discount.toString(),
    total: pricing.total.toString(),
  });

  // Navigate to confirmation page
  router.push(`/booking/${type}/${data.slug}/confirm?${params.toString()}`);
};


// ${params.toString()}

  /* ============ RENDER ============ */

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white ">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ============ LEFT COLUMN ============ */}
          <div className="lg:col-span-8 space-y-6 mt-4">
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
            <section className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 mb-2.5">
                {data.name}
              </h1>

              <div className="flex flex-wrap items-center gap-2 text-sm mb-3">
                <div className="flex items-center gap-1.5">
                  <MapPinIcon className="w-4 h-4 text-orange-500" />
                  <span className="font-medium text-gray-900">
                    {data.location}
                  </span>
                </div>

                {data.duration && (
                  <>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center gap-1.5">
                      <ClockIcon className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-700">{data.duration}</span>
                    </div>
                  </>
                )}

                {data.bestTimeToVisit && (
                  <>
                    <span className="text-gray-300">•</span>
                    <div className="flex items-center gap-1.5">
                      <SparklesIcon className="w-4 h-4 text-purple-500" />
                      <span className="text-gray-700">
                        Best: {data.bestTimeToVisit}
                      </span>
                    </div>
                  </>
                )}

                {data.difficulty && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="bg-orange-500 text-white px-2.5 py-1 rounded-md text-xs font-semibold capitalize">
                      {data.difficulty}
                    </span>
                  </>
                )}
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1.5 rounded-md">
                  <ShieldCheckIcon className="w-3.5 h-3.5" />
                  <span>Verified Operator</span>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-md">
                  <BoltIcon className="w-3.5 h-3.5" />
                  <span>Instant Confirmation</span>
                </div>
              </div>
            </section>

            {/* Description */}
            <section className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-2">
                About This Experience
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm">
                {displayData.description}
              </p>
            </section>

            {/* Highlights */}
            {displayData.highlights.length > 0 && (
              <section className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  {type === "activity" ? "What's Included" : "Highlights"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {displayData.highlights.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Agency */}
            <section className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                Hosted By
              </h2>
              <div className="flex items-start gap-3">
                <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-orange-500 to-red-500 shadow-sm">
                  <div className="w-full h-full flex items-center justify-center text-white text-xl font-bold">
                    {displayData.agency.name.charAt(0)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-gray-900 mb-1">
                    {displayData.agency.name}
                  </h3>
                  <p className="text-xs text-gray-600 mb-2 flex items-center gap-1.5">
                    <ShieldCheckIcon className="w-3.5 h-3.5 text-green-600" />
                    Verified • 500+ tours completed
                  </p>
                  <p className="text-gray-700 text-sm line-clamp-2">
                    {displayData.agency.description}
                  </p>
                </div>
              </div>
            </section>

            {/* Recommended Activities */}
            {dummyRecommendedItems.length > 0 && (
              <section className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Recommended Activities
                  </h2>

                  {dummyRecommendedItems.length > 3 && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const container =
                            document.getElementById("recommended-scroll");
                          container?.scrollBy({
                            left: -320,
                            behavior: "smooth",
                          });
                        }}
                        className="p-2 rounded-full border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all"
                        aria-label="Previous"
                      >
                        <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => {
                          const container =
                            document.getElementById("recommended-scroll");
                          container?.scrollBy({
                            left: 320,
                            behavior: "smooth",
                          });
                        }}
                        className="p-2 rounded-full border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all"
                        aria-label="Next"
                      >
                        <ChevronRightIcon className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  )}
                </div>

                <div
                  id="recommended-scroll"
                  className={`${
                    dummyRecommendedItems.length > 3
                      ? "flex gap-4 overflow-x-auto scrollbar-hide pb-2"
                      : "grid grid-cols-1 md:grid-cols-3 gap-4"
                  }`}
                >
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
            <section className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Customer Reviews
              </h2>

              {/* Rating Overview */}
              <div className="flex items-start gap-6 mb-6 pb-5 border-b border-gray-200">
                {/* Average Rating */}
                <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold text-gray-900 mb-1">
                    {averageRating}
                  </div>
                  <div className="flex items-center gap-0.5 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(parseFloat(averageRating))
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600">
                    {reviews.length || data.reviewCount} reviews
                  </p>
                </div>

                {/* Rating Bars */}
                <div className="flex-1 space-y-2">
                  {[5, 4, 3, 2, 1].map((rating, idx) => {
                    const count = ratingDistribution[idx];
                    const totalReviews = reviews.length || 1;
                    const percentage = (count / totalReviews) * 100;
                    return (
                      <div key={rating} className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5 w-16">
                          <span className="text-xs text-gray-700 font-medium">
                            {rating}
                          </span>
                          <StarIcon className="w-3 h-3 text-gray-400" />
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 w-10 text-right">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-4">
                {reviews.length > 0 ? (
                  <>
                    {reviews
                      .slice(
                        currentPage * reviewsPerPage,
                        (currentPage + 1) * reviewsPerPage
                      )
                      .map((review) => (
                        <div
                          key={review.id}
                          className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold flex-shrink-0 text-sm">
                              {review.userName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-gray-900 text-sm">
                                  {review.userName}
                                </h4>
                                <span className="text-gray-300">•</span>
                                <span className="text-xs text-gray-500">
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
                              <div className="flex items-center gap-0.5 mb-2">
                                {[...Array(5)].map((_, i) => (
                                  <StarIcon
                                    key={i}
                                    className={`w-3.5 h-3.5 ${
                                      i < review.rating
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <p className="text-gray-700 text-sm leading-relaxed">
                                {review.comment}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-200">
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(0, prev - 1))
                          }
                          disabled={currentPage === 0}
                          className="p-2 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          aria-label="Previous page"
                        >
                          <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
                        </button>

                        <div className="flex items-center gap-1">
                          {[...Array(totalPages)].map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentPage(idx)}
                              className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                                currentPage === idx
                                  ? "bg-orange-500 text-white"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                            >
                              {idx + 1}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(totalPages - 1, prev + 1)
                            )
                          }
                          disabled={currentPage === totalPages - 1}
                          className="p-2 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          aria-label="Next page"
                        >
                          <ChevronRightIcon className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-0.5 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className="w-6 h-6 text-gray-300" />
                      ))}
                    </div>
                    <p className="text-gray-600 font-medium text-sm mb-1">
                      No reviews yet
                    </p>
                    <p className="text-xs text-gray-500">
                      Be the first to share your experience!
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* ============ DESKTOP BOOKING CARD (STICKY) ============ */}
          <div className="hidden lg:block lg:col-span-4 mt-4">
            <div className="top-6">
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
                  handleBookNow;
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

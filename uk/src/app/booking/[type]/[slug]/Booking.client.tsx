// app/booking/[type]/[slug]/BookingClient.tsx

"use client";

import { useState, useMemo, useCallback, useEffect } from "react";

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

import { BookingGallery } from "@/components/booking/BookingGallery";
import { BookingCard } from "@/components/booking/BookingCard";
import { useRouter } from "next/navigation";
import { ReviewsSection } from "@/components/booking/ReviewsSection";
import { RecommendedActivities } from "@/components/booking/RecommendedActivities";
import { dummyRecommendedItems } from "@/lib/bookingSection/recommendedData";
import { BookingDetails } from "@/components/booking/BookingDetails";

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
    [booking.adults, booking.children, booking.packageType],
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
    [booking, data.priceMin],
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
    [availableDates],
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
        Math.min(config.maxAdults - prev.children, prev.adults + delta),
      );
      return { ...prev, adults: nextAdults };
    });
  };

  const handleChildrenChange = (delta: number) => {
    setBooking((prev) => {
      const config = PACKAGE_CONFIG[prev.packageType];
      const nextChildren = Math.max(
        0,
        Math.min(config.maxAdults - prev.adults, prev.children + delta),
      );
      return { ...prev, children: nextChildren };
    });
  };

  const handleRoomsChange = (delta: number) => {
    setBooking((prev) => ({
      ...prev,
      rooms: Math.max(
        roomLimits.min,
        Math.min(roomLimits.max, prev.rooms + delta),
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

            {/* Details Sections */}
            <BookingDetails
              name={data.name}
              location={data.location}
              duration={data.duration}
              bestTimeToVisit={data.bestTimeToVisit}
              difficulty={data.difficulty}
              description={displayData.description}
              highlights={displayData.highlights}
              agency={displayData.agency}
              type={type}
            />

            {/* Recommended Activities */}
            <RecommendedActivities items={dummyRecommendedItems} />

            {/* MOBILE BOOKING CARD */}
            <div className="lg:hidden">
              <BookingCard
                booking={booking}
                destination={data.slug}
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
                onBookNow={() => {}}
              />
            </div>

            {/* Reviews */}
            <ReviewsSection
              reviews={reviews}
              fallbackRating={data.rating}
              fallbackReviewCount={data.reviewCount}
            />
          </div>

          {/* ============ DESKTOP BOOKING CARD (STICKY) ============ */}
          <div className="hidden lg:block lg:col-span-4 mt-4">
            <div className="top-6">
              <BookingCard
                booking={booking}
                destination={data.slug}
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
                onBookNow={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

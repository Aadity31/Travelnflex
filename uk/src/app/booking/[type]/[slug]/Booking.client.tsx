// app/booking/[type]/[slug]/BookingClient.tsx

"use client";

import { useState, useMemo, useCallback, useEffect, Suspense, lazy } from "react";
import dynamic from "next/dynamic";
import {
  PACKAGE_CONFIG,
  getRoomLimits,
  calculatePricing,
  BookingState,
  PackageType,
} from "@/lib/bookingSection/booking";

import {
  Review,
} from "@/lib/bookingSection/reviews";

// Lazy load heavy components for better performance
const BookingGallery = dynamic(
  () => import("@/components/booking/BookingGallery").then((mod) => mod.BookingGallery),
  { 
    loading: () => <GallerySkeleton />,
    ssr: true 
  }
);

const BookingCard = dynamic(
  () => import("@/components/booking/BookingCard").then((mod) => mod.BookingCard),
  { 
    loading: () => <BookingCardSkeleton />,
    ssr: false 
  }
);

const ReviewsSection = dynamic(
  () => import("@/components/booking/ReviewsSection").then((mod) => mod.ReviewsSection),
  { 
    loading: () => <ReviewsSkeleton />,
    ssr: true 
  }
);

const RecommendedActivities = dynamic(
  () => import("@/components/booking/RecommendedActivities").then((mod) => mod.RecommendedActivities),
  { 
    loading: () => <RecommendationsSkeleton />,
    ssr: false 
  }
);

import { BookingDetails } from "@/components/booking/BookingDetails";
import { dummyRecommendedItems } from "@/lib/bookingSection/recommendedData";

// Skeleton components for lazy loading
function GallerySkeleton() {
  return (
    <div className="animate-pulse bg-gray-200 rounded-2xl h-96 w-full" aria-hidden="true" />
  );
}

function BookingCardSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-2xl p-6 space-y-6">
      <div className="h-8 bg-gray-200 rounded w-1/3" />
      <div className="h-12 bg-gray-200 rounded" />
      <div className="h-24 bg-gray-200 rounded" />
      <div className="h-32 bg-gray-200 rounded" />
    </div>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/4" />
      <div className="h-24 bg-gray-200 rounded" />
      <div className="h-24 bg-gray-200 rounded" />
    </div>
  );
}

function RecommendationsSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/4" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-gray-200 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

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
  hotelImages?: string[];
  hotelImagePublicIds?: string[];
}

interface BookingClientProps {
  data: UnifiedData;
  reviews: Review[];
  type: "activity" | "destination";
}

// Error boundary component
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class BookingErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Booking page error:", error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">We encountered an error while loading this page.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

import React from "react";

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
  const [isClient, setIsClient] = useState(false);
  const [availableDates, setAvailableDates] = useState<Record<string, number>>({});
  const [loadingDates, setLoadingDates] = useState(true);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch available dates from API
  useEffect(() => {
    if (!isClient || !data?.id) return;

    const fetchAvailableDates = async () => {
      try {
        setLoadingDates(true);
        const response = await fetch(
          `/api/destinations/available-dates?destinationId=${data.id}`
        );
        const result = await response.json();

        if (result.success && result.dates) {
          setAvailableDates(result.dates);
        } else {
          // Fallback to mock dates if no data in DB
          console.warn('No available dates in DB, using fallback');
        }
      } catch (error) {
        console.error('Failed to fetch available dates:', error);
      } finally {
        setLoadingDates(false);
      }
    };

    fetchAvailableDates();
  }, [isClient, data?.id]);

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

  const goPrevMonth = useCallback(() => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() - 1);
    if (newMonth >= new Date()) {
      setCurrentMonth(newMonth);
    }
  }, [currentMonth]);

  const goNextMonth = useCallback(() => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  }, [currentMonth]);

  const handleAdultsChange = useCallback((delta: number) => {
    setBooking((prev) => {
      const config = PACKAGE_CONFIG[prev.packageType];
      const nextAdults = Math.max(
        config.minAdults,
        Math.min(config.maxAdults - prev.children, prev.adults + delta),
      );
      return { ...prev, adults: nextAdults };
    });
  }, []);

  const handleChildrenChange = useCallback((delta: number) => {
    setBooking((prev) => {
      const config = PACKAGE_CONFIG[prev.packageType];
      const nextChildren = Math.max(
        0,
        Math.min(config.maxAdults - prev.adults, prev.children + delta),
      );
      return { ...prev, children: nextChildren };
    });
  }, []);

  const handleRoomsChange = useCallback((delta: number) => {
    setBooking((prev) => ({
      ...prev,
      rooms: Math.max(
        roomLimits.min,
        Math.min(roomLimits.max, prev.rooms + delta),
      ),
    }));
  }, [roomLimits.min, roomLimits.max]);

  /* ============ CALENDAR LOGIC ============ */

  const getDaysInMonth = useCallback((date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  }, []);

  const { daysInMonth, startingDayOfWeek } = useMemo(
    () => getDaysInMonth(currentMonth),
    [currentMonth, getDaysInMonth]
  );

  const isDateAvailable = useCallback(
    (day: number) => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split("T")[0];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return date >= today && availableDates[dateStr] > 0;
    },
    [currentMonth, availableDates]
  );

  const getDateString = useCallback(
    (day: number) => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const date = new Date(year, month, day);
      return date.toISOString().split("T")[0];
    },
    [currentMonth]
  );

  /* ============ SAFE DATA ACCESS ============ */

  const displayData = useMemo(() => ({
    description:
      data.description ||
      data.shortDescription ||
      "Experience the best of India with our carefully curated tours.",
    images:
      data.images && data.images.length > 0
        ? data.images
        : ["/placeholder-image.jpg"],
    hotelImages:
      data.hotelImages && data.hotelImages.length > 0
        ? data.hotelImages
        : [],
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
  }), [data, type]);

  /* ============ SEO METADATA ============ */

  useEffect(() => {
    if (isClient && data) {
      // Update page title for SEO
      document.title = `${data.name} - Book Now | Devbhoomi Darshan`;
      
      // Set meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute(
          "content",
          data.shortDescription || data.description || `Book your ${type} to ${data.name} with Devbhoomi Darshan. Starting at ₹${data.priceMin}.`
        );
      }
    }
  }, [isClient, data, type]);

  /* ============ RENDER ============ */

  // Prevent hydration mismatch by not rendering until client
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500" />
      </div>
    );
  }

  return (
    <BookingErrorBoundary>
      <main className="min-h-screen bg-gray-50 pb-24 lg:pb-0">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* ============ LEFT COLUMN ============ */}
            <div className="lg:col-span-8 space-y-8">
              {/* IMAGE GALLERY */}
              <Suspense fallback={<GallerySkeleton />}>
                <BookingGallery
                  images={displayData.images}
                  hotelImages={displayData.hotelImages}
                  name={data.name}
                  type={type}
                  activityType={data.type}
                  rating={data.rating}
                  reviewCount={data.reviewCount}
                />
              </Suspense>

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
              <Suspense fallback={<RecommendationsSkeleton />}>
                <RecommendedActivities items={dummyRecommendedItems} />
              </Suspense>

              {/* Reviews */}
              <Suspense fallback={<ReviewsSkeleton />}>
                <ReviewsSection
                  reviews={reviews}
                  fallbackRating={data.rating}
                  fallbackReviewCount={data.reviewCount}
                />
              </Suspense>
            </div>

            {/* ============ DESKTOP BOOKING CARD (STICKY) ============ */}
            <div className="hidden lg:block lg:col-span-4">
              <div className="sticky top-8">
                <Suspense fallback={<BookingCardSkeleton />}>
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
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </div>

        {/* ============ MOBILE BOOKING CARD ============ */}
        <div className="lg:hidden">
          <Suspense fallback={<BookingCardSkeleton />}>
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
            />
          </Suspense>
        </div>
      </main>
    </BookingErrorBoundary>
  );
}

// app/booking/[type]/[slug]/BookingClient.tsx

"use client";

import { useState, useMemo, useCallback, useEffect, Suspense } from "react";
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
  // Package-specific pricing (from destination_prices table)
  soloTravelerPrice?: number;
  familyPackagePrice?: number;
  joinGroupPrice?: number;
  ownGroupPrice?: number;
  hotelPerPerson?: number;
  // Package-specific includes (from destination_prices table)
  soloTravelerIncludes?: string[];
  familyPackageIncludes?: string[];
  joinGroupIncludes?: string[];
  ownGroupIncludes?: string[];
  // Discount - can be simple (for activities) or package-specific (for destinations)
  discount?: {
    soloTraveler?: { percentage: number; validUntil: string };
    familyPackage?: { percentage: number; validUntil: string };
    joinGroup?: { percentage: number; validUntil: string };
    ownGroup?: { percentage: number; validUntil: string };
  } | { percentage: number; validUntil: string }; // Simple format for activities
}

interface BookingClientProps {
  data: UnifiedData;
  reviews: Review[];
  type: "activity" | "destination";
  availableDates?: Record<string, number>;
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

// New activity components imports
import AboutSection from "@/components/booking/activityComp/AboutSection";
import BookingSidebar from "@/components/booking/activityComp/BookingSidebar";
import HighlightsSection from "@/components/booking/activityComp/HighlightsSection";
import IncludedSection from "@/components/booking/activityComp/IncludedSection";
import HeroWithGallery from "@/components/booking/activityComp/HeroGallerySection";

/* ============ COMPONENT ============ */

export default function BookingClient({
  data,
  reviews,
  type,
  availableDates: initialAvailableDates = {},
}: BookingClientProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableDates, setAvailableDates] = useState<Record<string, number>>({});
  const [isLoadingDates, setIsLoadingDates] = useState(false);
  const [nextMonthWarning, setNextMonthWarning] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingState>({
    packageType: "solo",
    adults: 1,
    children: 0,
    rooms: 1,
    selectedDate: null,
    availableSlots: 0,
  });
  const [isClient, setIsClient] = useState(false);


  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Map internal package type to database package type
  const getDbPackageType = (pkgType: PackageType): string => {
    switch (pkgType) {
      case "solo":
        return "solo_traveler";
      case "family":
        return "family_package";
      case "group":
        return "join_group";
      case "private":
        return "own_group";
      default:
        return "solo_traveler";
    }
  };

  // Fetch available dates when package type changes
  const fetchAvailableDates = useCallback(async (pkgType: PackageType) => {
    if (!data?.id) return;
    
    setIsLoadingDates(true);
    try {
      const dbPackageType = getDbPackageType(pkgType);
      const params = new URLSearchParams({
        type,
        id: data.id,
        packageType: dbPackageType,
      });
      
      const response = await fetch(`/api/available-dates?${params}`);
      if (response.ok) {
        const result = await response.json();
        if (Object.keys(result.availableDates || {}).length > 0) {
          setAvailableDates(result.availableDates);
        } else {
          // Fallback to initial dates if no specific package dates
          setAvailableDates(initialAvailableDates);
        }
      } else {
        setAvailableDates(initialAvailableDates);
      }
    } catch (error) {
      console.error("Error fetching available dates:", error);
      setAvailableDates(initialAvailableDates);
    } finally {
      setIsLoadingDates(false);
    }
  }, [data?.id, type, initialAvailableDates]);

  // Initial fetch of available dates
  useEffect(() => {
    if (isClient && data?.id) {
      // Use initial dates from server first
      if (Object.keys(initialAvailableDates).length > 0) {
        setAvailableDates(initialAvailableDates);
      } else {
        // Fetch dates for initial package type
        fetchAvailableDates("solo");
      }
    }
  }, [isClient, data?.id, initialAvailableDates, fetchAvailableDates]);

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

  // Get price based on package type from destination_prices table
  const getPriceByPackageType = useCallback((pkgType: PackageType): number => {
    if (!data) return 0;
    
    switch (pkgType) {
      case "solo":
        return data.soloTravelerPrice || data.priceMin;
      case "family":
        return data.familyPackagePrice || data.priceMin;
      case "private":
        return data.ownGroupPrice || data.priceMin;
      case "group":
        return data.joinGroupPrice || data.priceMin;
      default:
        return data.priceMin;
    }
  }, [data]);

  // Get current price based on selected package type
  const currentPrice = useMemo(
    () => getPriceByPackageType(booking.packageType),
    [booking.packageType, getPriceByPackageType],
  );

  // Get effective discount percentage for selected package type
  const effectiveDiscount = useMemo(() => {
    if (!data?.discount) return 0;
    
    // Handle simple discount format (for activities)
    if ('percentage' in data.discount && !('soloTraveler' in data.discount)) {
      const simpleDiscount = data.discount as { percentage: number; validUntil: string };
      if (!simpleDiscount.percentage) return 0;
      
      const validUntilDate = new Date(simpleDiscount.validUntil);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (validUntilDate < today) return 0;
      
      return simpleDiscount.percentage / 100;
    }
    
    // Handle package-specific discount format (for destinations)
    const discountKey = booking.packageType === 'solo' ? 'soloTraveler'
      : booking.packageType === 'family' ? 'familyPackage'
      : booking.packageType === 'group' ? 'joinGroup'
      : 'ownGroup';
    
    // Cast to package-specific type
    const packageDiscounts = data.discount as {
      soloTraveler?: { percentage: number; validUntil: string };
      familyPackage?: { percentage: number; validUntil: string };
      joinGroup?: { percentage: number; validUntil: string };
      ownGroup?: { percentage: number; validUntil: string };
    };
    
    const packageDiscount = packageDiscounts[discountKey];
    if (!packageDiscount) return 0;
    
    const { percentage, validUntil } = packageDiscount;
    if (!percentage) return 0;
    
    // Check if discount is still valid
    const validUntilDate = new Date(validUntil);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (validUntilDate < today) return 0;
    
    return percentage / 100; // Convert to decimal
  }, [data?.discount, booking.packageType]);

  const pricing = useMemo(
    () => {
      // Pass currentPrice, effectiveDiscount, and hotelPerPerson to calculatePricing
      // calculatePricing will apply the database discount rate
      const result = calculatePricing(booking, currentPrice, effectiveDiscount, data.hotelPerPerson || 0);
      
      // Add discount info to result
      return {
        ...result,
        originalPrice: currentPrice,
        discountPercentage: effectiveDiscount > 0 ? effectiveDiscount * 100 : 0,
      };
    },
    [booking, currentPrice, effectiveDiscount, data.hotelPerPerson],
  );

  /* ============ HANDLERS ============ */

  const handlePackageChange = useCallback(
    (pkg: PackageType) => {
      const config = PACKAGE_CONFIG[pkg];
      setBooking({
        packageType: pkg,
        adults: config.minAdults,
        children: 0,
        rooms: 1,
        selectedDate: null,
        availableSlots: 0,
      });
      // Fetch available dates for the new package type
      fetchAvailableDates(pkg);
    },
    [fetchAvailableDates]
  );

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
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() - 1);
    // Only allow going back if the new month is the current month or future
    if (newMonth.getTime() >= today.getTime()) {
      setCurrentMonth(newMonth);
    }
  }, [currentMonth]);

  const goNextMonth = useCallback(() => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + 1);
    
    // Check if there are any available dates in the next month
    const year = newMonth.getFullYear();
    const month = String(newMonth.getMonth() + 1).padStart(2, '0');
    const nextMonthPrefix = `${year}-${month}`;
    
    const hasDatesInNextMonth = Object.keys(availableDates).some(
      (date) => date.startsWith(nextMonthPrefix)
    );
    
    if (!hasDatesInNextMonth) {
      setNextMonthWarning("No schedules available for next month");
      setTimeout(() => setNextMonthWarning(null), 3000);
      return;
    }
    
    setCurrentMonth(newMonth);
  }, [currentMonth, availableDates]);

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
      // Fix timezone issue by using toLocaleDateString instead of toISOString
      const dateStr = date.toLocaleDateString('en-CA'); // YYYY-MM-DD in local time
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
      // Fix timezone issue by using toLocaleDateString instead of toISOString
      return date.toLocaleDateString('en-CA'); // YYYY-MM-DD in local time
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
    // Use solo traveler includes for destinations
    includes:
      type === "destination"
        ? data.soloTravelerIncludes || []
        : data.includes || [],
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
<div className="lg:col-span-8 flex flex-col gap-[1rem]">
  {type === "activity" ? (
    /* ============ NEW ACTIVITY LAYOUT ============ */
    <>
      {/* Hero Gallery */}
      <HeroWithGallery
        title={data.name}
        location={data.location}
        duration={data.duration || ""}
        category={data.type || "Activity"}
        rating={data.rating}
        reviewCount={data.reviewCount}
        images={displayData.images.map((url, index) => ({
          url,
          alt: `${data.name} - Image ${index + 1}`,
          caption: `${data.name} - Image ${index + 1}`,
        }))}
      />

      {/* About Section */}
      <AboutSection
        title="About this experience"
        paragraphs={[displayData.description]}
      />

      {/* Highlights Section */}
      <HighlightsSection
        title="Highlights"
        highlights={displayData.highlights.map((h) => ({ title: h }))}
      />

      {/* Included Section */}
      <IncludedSection
        title="What's included"
        items={displayData.includes}
      />

      {/* Recommended Activities */}
      <div className="w-full overflow-hidden">
        <RecommendedActivities items={dummyRecommendedItems} />
      </div>
    </>
  ) : (
    /* ============ DESTINATION LAYOUT ============ */
    <>
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
      <div className="hidden lg:block">
        <BookingDetails
          name={data.name}
          location={data.location}
          duration={data.duration}
          bestTimeToVisit={data.bestTimeToVisit}
          difficulty={data.difficulty}
          description={displayData.description}
          highlights={displayData.highlights}
          includes={displayData.includes}
          type={type}
        />
      </div>

      {/* Recommended Activities */}
      <Suspense fallback={<RecommendationsSkeleton />}>
        <RecommendedActivities items={dummyRecommendedItems} />
      </Suspense>
    </>
  )}

  {/* Reviews - Always show for both types */}
  <Suspense fallback={<ReviewsSkeleton />}>
    <ReviewsSection
      reviews={reviews}
      fallbackRating={data.rating}
      fallbackReviewCount={data.reviewCount}
    />
  </Suspense>
</div>



            {/* ============ RIGHT COLUMN - CONDITIONAL RENDERING ============ */}
<div className="hidden lg:block lg:col-span-4">
  <div className="sticky top-8">
    {type === "destination" ? (
      // Existing destination booking card
      <Suspense fallback={<BookingCardSkeleton />}>
        <BookingCard
          booking={booking}
          destination={data.slug}
          roomLimits={roomLimits}
          pricing={pricing}
          basePrice={currentPrice}
          hotelPerPerson={data.hotelPerPerson}
          calendar={{
            currentMonth,
            daysInMonth,
            startingDayOfWeek,
            isDateAvailable,
            getDateString,
            goPrevMonth,
            goNextMonth,
            isLoadingDates,
            nextMonthWarning,
          }}
          onPackageChange={handlePackageChange}
          onAdultsChange={handleAdultsChange}
          onChildrenChange={handleChildrenChange}
          onRoomsChange={handleRoomsChange}
          onDateSelect={handleDateSelect}
          discounts={data.discount}
        />
      </Suspense>
    ) : (
      /* ============ NEW ACTIVITY BOOKING SIDEBAR ============ */
      <BookingSidebar
        price={currentPrice}
        originalPrice={pricing.originalPrice || currentPrice}
        nextDate={data.discount && 'percentage' in data.discount ? new Date(data.discount.validUntil).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Available Now'}
        remainingSeats={10}
        cancellationPolicy="Free cancellation up to 48 hours before the start of the experience. Full refund within 5 business days."
        title={data.name}
        category={data.type || 'Activity'}
        rating={data.rating}
        reviewCount={data.reviewCount}
        duration={data.duration || ''}
        location={data.location}
        difficulty={data.difficulty || ''}
        activityId={data.id}
        activitySlug={data.slug}
        currency={data.currency || 'INR'}
        onAddToCart={() => console.log('Added to cart')}
      />
    )}
  </div>
</div>

          </div>
        </div>

        {/* ============ MOBILE BOOKING CARD / STICKY BAR ============ */}
<div className="lg:hidden">
  {type === "destination" ? (
    // Existing destination booking card
    <Suspense fallback={<BookingCardSkeleton />}>
      <BookingCard
        booking={booking}
        destination={data.slug}
        roomLimits={roomLimits}
        pricing={pricing}
        basePrice={currentPrice}
        hotelPerPerson={data.hotelPerPerson}
        calendar={{
          currentMonth,
          daysInMonth,
          startingDayOfWeek,
          isDateAvailable,
          getDateString,
          goPrevMonth,
          goNextMonth,
          isLoadingDates,
          nextMonthWarning,
        }}
        onPackageChange={handlePackageChange}
        onAdultsChange={handleAdultsChange}
        onChildrenChange={handleChildrenChange}
        onRoomsChange={handleRoomsChange}
        onDateSelect={handleDateSelect}
        discounts={data.discount}
      />
    </Suspense>
  ) : (
    /* ============ NEW ACTIVITY BOOKING SIDEBAR (MOBILE) ============ */
    <BookingSidebar
      price={currentPrice}
      originalPrice={pricing.originalPrice || currentPrice}
      nextDate={data.discount && 'percentage' in data.discount ? new Date(data.discount.validUntil).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Available Now'}
      remainingSeats={10}
      cancellationPolicy="Free cancellation up to 48 hours before the start of the experience. Full refund within 5 business days."
      title={data.name}
      category={data.type || 'Activity'}
      rating={data.rating}
      reviewCount={data.reviewCount}
      duration={data.duration || ''}
      location={data.location}
      difficulty={data.difficulty || ''}
      activityId={data.id}
      activitySlug={data.slug}
      currency={data.currency || 'INR'}
      onAddToCart={() => console.log('Added to cart')}
    />
  )}
</div>


      </main>
    </BookingErrorBoundary>
  );
}

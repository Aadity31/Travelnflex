// app/booking/[type]/[slug]/BookingClient.tsx

"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Image from "next/image";
import {
  StarIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  UserGroupIcon,
  HomeIcon,
  CalendarIcon,
  SparklesIcon,
  ShieldCheckIcon,
  BoltIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";

/* ============ TYPES ============ */

type PackageType = "solo" | "family" | "private" | "group";

interface BookingState {
  packageType: PackageType;
  adults: number;
  children: number;
  rooms: number;
  selectedDate: string | null;
  availableSlots: number;
}

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
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
}

interface BookingClientProps {
  data: UnifiedData;
  reviews: Review[];
  type: "activity" | "destination";
}

/* ============ PACKAGE CONFIG (NO EMOJIS) ============ */
const PACKAGE_CONFIG = {
  solo: {
    label: "Solo Traveler",
    description: "Join existing group",
    minAdults: 1,
    maxAdults: 1,
    allowChildren: false,
    discount: 0,
  },
  family: {
    label: "Family Package",
    description: "2-8 people with children",
    minAdults: 1,
    maxAdults: 8,
    allowChildren: true,
    discount: 0.1,
  },
  private: {
    label: "Private Group",
    description: "8-20 adults only",
    minAdults: 8,
    maxAdults: 20,
    allowChildren: false,
    discount: 0.15,
  },
  group: {
    label: "Join Group",
    description: "Your group + others",
    minAdults: 1,
    maxAdults: 50,
    allowChildren: true,
    discount: 0.2,
  },
} as const;

/* ============ DUMMY AVAILABLE DATES ============ */
const getAvailableDates = () => {
  const dates: Record<string, number> = {};
  const today = new Date();

  for (let i = 1; i <= 60; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];

    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      dates[dateStr] = Math.floor(Math.random() * 50) + 10;
    }
  }

  return dates;
};

/* ============ COMPONENT ============ */

export default function BookingClient({
  data,
  reviews,
  type,
}: BookingClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
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
  const getRoomLimits = useCallback(
    (adults: number, children: number, packageType: PackageType) => {
      // SOLO: Always 1 room
      if (packageType === "solo") {
        return { min: 1, max: 1 };
      }

      // GROUP: Flexible rooms
      if (packageType === "group") {
        const totalPeople = adults + children;
        return {
          min: 1,
          max: Math.ceil(totalPeople / 2),
        };
      }

      // FAMILY: Specific logic
      if (packageType === "family") {
        const totalPeople = adults + children;

        // 2 people
        if (totalPeople === 2) {
          return { min: 1, max: 2 };
        }

        // 3 people
        if (totalPeople === 3) {
          return { min: 1, max: 3 };
        }

        // 4 people
        if (totalPeople === 4) {
          if (children > 0) {
            return { min: 1, max: 4 }; // Can share if kids
          }
          return { min: 2, max: 4 }; // 4 adults need min 2 rooms
        }

        // 5 people
        if (totalPeople === 5) {
          return { min: 3, max: 5 };
        }

        // 6 people
        if (totalPeople === 6) {
          return { min: 3, max: 6 };
        }

        // 7 people
        if (totalPeople === 7) {
          return { min: 4, max: 7 };
        }

        // 8 people
        if (totalPeople === 8) {
          return { min: 4, max: 8 };
        }

        return { min: 1, max: totalPeople };
      }

      // PRIVATE: 2 adults per room minimum
      if (packageType === "private") {
        const minRooms = Math.ceil(adults / 2); // Minimum 2 per room
        const maxRooms = adults; // Maximum 1 per room
        return { min: minRooms, max: maxRooms };
      }

      return { min: 1, max: 1 };
    },
    []
  );

  const roomLimits = useMemo(
    () => getRoomLimits(booking.adults, booking.children, booking.packageType),
    [booking.adults, booking.children, booking.packageType, getRoomLimits]
  );

  // Auto-adjust rooms when limits change
  useEffect(() => {
    setBooking((prev) => ({
      ...prev,
      rooms: Math.max(roomLimits.min, Math.min(prev.rooms, roomLimits.max)),
    }));
  }, [roomLimits.min, roomLimits.max]);

  /* ============ PRICE CALCULATION ============ */
  const pricing = useMemo(() => {
    const basePrice = data.priceMin;
    const discountRate = PACKAGE_CONFIG[booking.packageType].discount;
    const pricePerPerson = basePrice * (1 - discountRate);

    const totalPeople = booking.adults + booking.children * 0.5;
    const peopleTotal = Math.round(pricePerPerson * totalPeople);
    const roomCost = booking.rooms * 500;
    const subtotal = peopleTotal + roomCost;
    const discount = (basePrice - pricePerPerson) * booking.adults;
    const total = subtotal;

    return {
      pricePerPerson: Math.round(pricePerPerson),
      peopleTotal,
      roomCost,
      subtotal: Math.round(subtotal),
      discount: Math.round(discount),
      total: Math.round(total),
    };
  }, [
    booking.packageType,
    booking.adults,
    booking.children,
    booking.rooms,
    data.priceMin,
  ]);

  /* ============ REVIEWS CALCULATION ============ */
  const averageRating = useMemo(() => {
    if (reviews.length === 0) return data.rating.toFixed(1);
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  }, [reviews, data.rating]);

  const ratingDistribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0];
    reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        dist[review.rating - 1]++;
      }
    });
    return dist.reverse();
  }, [reviews]);

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

  /* ============ BOOKING CARD COMPONENT ============ */
  const BookingCard = () => (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      {/* Price Header */}
      <div className="border-b border-gray-100 p-5">
        <div className="flex items-end gap-2 mb-1">
          <span className="text-3xl font-semibold text-gray-900">
            ₹{pricing.pricePerPerson}
          </span>
          <span className="text-xs text-gray-500 mb-1">per person</span>
        </div>

        {pricing.discount > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="line-through text-gray-400">₹{data.priceMin}</span>
            <span className="inline-flex px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium">
              Save ₹{pricing.discount}
            </span>
          </div>
        )}
      </div>
      <div className="p-6 space-y-6">
        {/* ============ PACKAGE SELECTION (NO EMOJI) ============ */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3">
            Choose Package Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(PACKAGE_CONFIG) as PackageType[]).map((pkg) => {
              const isActive = booking.packageType === pkg;
              return (
                <button
                  key={pkg}
                  onClick={() => handlePackageChange(pkg)}
                  className={`rounded-xl border text-left p-3 transition-colors ${
                    isActive
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-orange-300"
                  }`}
                >
                  <div className="text-sm font-medium text-gray-900">
                    {PACKAGE_CONFIG[pkg].label}
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5">
                    {PACKAGE_CONFIG[pkg].description}
                  </div>
                  {PACKAGE_CONFIG[pkg].discount > 0 && (
                    <div className="mt-1 text-xs font-semibold text-green-600">
                      {PACKAGE_CONFIG[pkg].discount * 100}% OFF
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ============ TRAVELERS SELECTION ============ */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3">
            <UserGroupIcon className="w-4 h-4 inline mr-1" />
            Number of Travelers
          </label>

          {/* Adults */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-700 font-medium">Adults</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    setBooking((prev) => ({
                      ...prev,
                      adults: Math.max(
                        PACKAGE_CONFIG[prev.packageType].minAdults,
                        prev.adults - 1
                      ),
                    }))
                  }
                  disabled={
                    booking.adults <=
                    PACKAGE_CONFIG[booking.packageType].minAdults
                  }
                  className={counterButtonClasses}
                  aria-label="Decrease adults"
                >
                  -
                </button>
                <span className="text-xl font-bold text-gray-900 w-8 text-center">
                  {booking.adults}
                </span>
                <button
                  onClick={() =>
                    setBooking((prev) => ({
                      ...prev,
                      adults: Math.min(
                        PACKAGE_CONFIG[prev.packageType].maxAdults -
                          prev.children,
                        prev.adults + 1
                      ),
                    }))
                  }
                  disabled={
                    booking.adults + booking.children >=
                    PACKAGE_CONFIG[booking.packageType].maxAdults
                  }
                  className={counterButtonClasses}
                  aria-label="Increase adults"
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
                    onClick={() =>
                      setBooking((prev) => ({
                        ...prev,
                        children: Math.max(0, prev.children - 1),
                      }))
                    }
                    disabled={booking.children <= 0}
                    className={counterButtonClasses}
                    aria-label="Decrease children"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold text-gray-900 w-8 text-center">
                    {booking.children}
                  </span>
                  <button
                    onClick={() =>
                      setBooking((prev) => ({
                        ...prev,
                        children: Math.min(
                          PACKAGE_CONFIG[prev.packageType].maxAdults -
                            prev.adults,
                          prev.children + 1
                        ),
                      }))
                    }
                    disabled={
                      booking.adults + booking.children >=
                      PACKAGE_CONFIG[booking.packageType].maxAdults
                    }
                    className={counterButtonClasses}
                    aria-label="Increase children"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============ ROOM SELECTION (EDITABLE) ============ */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3">
            <HomeIcon className="w-4 h-4 inline mr-1" />
            Rooms Required
          </label>
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
            <button
              onClick={() =>
                setBooking((prev) => ({
                  ...prev,
                  rooms: Math.max(roomLimits.min, prev.rooms - 1),
                }))
              }
              disabled={booking.rooms <= roomLimits.min}
              className={counterButtonClasses}
              aria-label="Decrease rooms"
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
              onClick={() =>
                setBooking((prev) => ({
                  ...prev,
                  rooms: Math.min(roomLimits.max, prev.rooms + 1),
                }))
              }
              disabled={booking.rooms >= roomLimits.max}
              className={counterButtonClasses}
              aria-label="Increase rooms"
            >
              +
            </button>
          </div>
        </div>

        {/* ============ CALENDAR ============ */}
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <label className="block text-sm font-bold text-gray-900 mb-3">
            <CalendarIcon className="w-4 h-4 inline mr-1" />
            Select Available Date
          </label>

          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => {
                const newMonth = new Date(currentMonth);
                newMonth.setMonth(currentMonth.getMonth() - 1);
                if (newMonth >= new Date()) {
                  setCurrentMonth(newMonth);
                }
              }}
              className={counterButtonClasses}
              aria-label="Previous month"
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
              onClick={() => {
                const newMonth = new Date(currentMonth);
                newMonth.setMonth(currentMonth.getMonth() + 1);
                setCurrentMonth(newMonth);
              }}
              className={counterButtonClasses}
              aria-label="Next month"
            >
              <ChevronRightIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Calendar Grid */}
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
                  // Empty cells to keep 6 rows always
                  return <div key={index} className="aspect-square" />;
                }

                const dateStr = getDateString(dayNumber);
                const isAvailable = isDateAvailable(dayNumber);
                const isSelected = booking.selectedDate === dateStr;

                return (
                  <button
                    key={index}
                    onClick={() => isAvailable && handleDateSelect(dateStr)}
                    disabled={!isAvailable}
                    className={`aspect-square rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      isSelected
                        ? "bg-orange-500 text-white"
                        : isAvailable
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

        {/* ============ PRICE BREAKDOWN ============ */}
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

        {/* ============ BOOK NOW BUTTON ============ */}
        <button
          disabled={!booking.selectedDate}
          className="w-full bg-orange-500 hover:bg-orange-600
             disabled:bg-gray-300 disabled:cursor-not-allowed
             text-white font-semibold py-3 rounded-xl
             transition-colors"
        >
          {!booking.selectedDate
            ? "Select a date to continue"
            : "Book now -  Pay later"}
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
  const counterButtonClasses =
    "inline-flex items-center justify-center rounded-full " +
    "border border-gray-200 bg-white text-gray-700 " +
    "w-8 h-8 sm:w-9 sm:h-9 " +
    "hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 " +
    "disabled:opacity-40 disabled:cursor-not-allowed " +
    "disabled:hover:border-gray-200 disabled:hover:text-gray-700 disabled:hover:bg-white " +
    "text-sm font-semibold transition-colors";

  /* ============ RENDER ============ */

  return (
    <main className="min-h-screen bg-[#F5F3EF] mt-6">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="hover:text-orange-600 cursor-pointer">Home</span>
            <span>/</span>
            <span className="hover:text-orange-600 cursor-pointer capitalize">
              {type}s
            </span>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">
              {data.name}
            </span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left column */}
          <div className="lg:col-span-8 space-y-6 lg:space-y-7">
            {/* ============ IMAGE GALLERY (FIXED, FULL IMAGE, RECTANGULAR THUMBNAILS) ============ */}
            <section className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* Cover Image - FULL IMAGE VISIBLE */}
              <div className="relative w-full aspect-[16/10] bg-gray-100">
                <Image
                  src={displayData.images[selectedImage]}
                  alt={data.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {type === "activity" && data.type && (
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg backdrop-blur-sm ${
                        data.type === "adventure"
                          ? "bg-red-500/90"
                          : data.type === "spiritual"
                          ? "bg-purple-500/90"
                          : data.type === "cultural"
                          ? "bg-blue-500/90"
                          : "bg-green-500/90"
                      }`}
                    >
                      {data.type.charAt(0).toUpperCase() + data.type.slice(1)}
                    </span>
                  )}
                  <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1">
                    <StarIcon className="w-4 h-4 text-yellow-500" />
                    {data.rating} ({data.reviewCount})
                  </span>
                </div>
              </div>
              {/* Thumbnails - RECTANGULAR (3:2 aspect ratio) */}
              <div className="p-3 grid grid-cols-3 sm:grid-cols-5 gap-2">
                {displayData.images.slice(0, 5).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-[3/2] rounded-lg overflow-hidden transition-all ${
                      selectedImage === idx
                        ? "ring-2 ring-orange-500"
                        : "ring-1 ring-gray-200 hover:ring-orange-300"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${data.name} ${idx + 1}`}
                      fill
                      sizes="150px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </section>

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
            {/* ============ mobile BOOKING CARD ============ */}
            <div className="mt-4 sm:mt-5 lg:hidden">
              <BookingCard />
            </div>

            {/* Description */}
            <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                About this experience
              </h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {displayData.description}
              </p>
            </section>

            {/* Highlights */}
            {displayData.highlights.length > 0 && (
              <section className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {type === "activity" ? "What&apos;s Included" : "Highlights"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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

            {/* ============ MOBILE BOOKING CARD ============ */}
            <div className="lg:hidden">
              <BookingCard />
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
                  <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-6 md:mb-8">
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
              <BookingCard />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

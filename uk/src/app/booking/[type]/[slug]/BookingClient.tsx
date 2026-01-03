// app/booking/[type]/[slug]/BookingClient.tsx

"use client";

import { useState, useMemo, useCallback } from "react";
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
} from "@heroicons/react/24/solid";

/* ============ TYPES ============ */

type PackageType = "solo" | "family" | "private" | "group";

interface BookingState {
  packageType: PackageType;
  seats: number;
  rooms: number;
  checkIn: string;
  checkOut: string;
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

/* ============ PACKAGE CONFIG (Outside component to avoid dependency issues) ============ */
const PACKAGE_CONFIG = {
  solo: {
    minSeats: 1,
    maxSeats: 1,
    label: "Solo Traveler",
    discount: 0,
    icon: "👤",
  },
  family: {
    minSeats: 2,
    maxSeats: 8,
    label: "Family Package",
    discount: 0.1,
    icon: "👨‍👩‍👧‍👦",
  },
  private: {
    minSeats: 8,
    maxSeats: 20,
    label: "Private Group",
    discount: 0.15,
    icon: "👥",
  },
  group: {
    minSeats: 8,
    maxSeats: 50,
    label: "Join Group",
    discount: 0.2,
    icon: "🎉",
  },
} as const;

/* ============ COMPONENT ============ */

export default function BookingClient({
  data,
  reviews,
  type,
}: BookingClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [booking, setBooking] = useState<BookingState>({
    packageType: "solo",
    seats: 1,
    rooms: 1,
    checkIn: "",
    checkOut: "",
  });

  /* ============ PRICE CALCULATION ============ */

  const pricing = useMemo(() => {
    const basePrice = data.priceMin;
    const discountRate = PACKAGE_CONFIG[booking.packageType].discount;
    const pricePerPerson = basePrice * (1 - discountRate);
    const roomCost = booking.rooms * 500;
    const subtotal = pricePerPerson * booking.seats + roomCost;
    const discount = (basePrice - pricePerPerson) * booking.seats;
    const total = subtotal;

    return {
      pricePerPerson: Math.round(pricePerPerson),
      roomCost,
      subtotal: Math.round(subtotal),
      discount: Math.round(discount),
      total: Math.round(total),
    };
  }, [booking.packageType, booking.seats, booking.rooms, data.priceMin]);

  // Max rooms calculation
  const maxRooms = Math.ceil(booking.seats / 2);

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
    setBooking((prev) => ({
      ...prev,
      packageType: pkg,
      seats: PACKAGE_CONFIG[pkg].minSeats,
      rooms: 1,
    }));
  }, []);

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
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-4 md:px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="hover:text-orange-600 cursor-pointer">Home</span>
            <span>/</span>
            <span className="hover:text-orange-600 cursor-pointer capitalize">
              {type}s
            </span>
            <span>/</span>
            <span className="text-gray-900 font-medium line-clamp-1">
              {data.name}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ============ LEFT COLUMN - MAIN CONTENT ============ */}
          <div className="lg:col-span-8 space-y-6">
            {/* ============ IMAGE GALLERY ============ */}
            <section className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              {/* Large Cover Image */}
              <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] bg-gray-100">
                <Image
                  src={displayData.images[selectedImage]}
                  alt={data.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                {/* Overlay badges */}
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

              {/* Thumbnail Grid */}
              <div className="p-4 grid grid-cols-5 gap-2">
                {displayData.images.slice(0, 5).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? "border-orange-500 scale-105 shadow-md"
                        : "border-gray-200 hover:border-orange-300"
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

            {/* ============ TITLE & QUICK INFO ============ */}
            <section className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
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

            {/* ============ DESCRIPTION ============ */}
            <section className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                About This Experience
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {displayData.description}
              </p>
            </section>

            {/* ============ HIGHLIGHTS ============ */}
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

            {/* ============ AGENCY DETAILS ============ */}
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

            {/* ============ REVIEWS SECTION ============ */}
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

          {/* ============ RIGHT COLUMN - BOOKING CARD (STICKY) ============ */}
          <div className="lg:col-span-4">
            <div className="sticky top-6">
              {/* Price Header */}
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-t-2xl p-6 text-white">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold">
                    ₹{pricing.pricePerPerson}
                  </span>
                  <span className="text-white/80">per person</span>
                </div>
                {pricing.discount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="line-through text-white/60">
                      ₹{data.priceMin}
                    </span>
                    <span className="bg-white/20 px-2 py-0.5 rounded text-sm font-semibold">
                      Save ₹{pricing.discount}
                    </span>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-b-2xl shadow-xl border border-gray-100 p-6">
                {/* ============ PACKAGE SELECTION ============ */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    Choose Your Package
                  </label>
                  <div className="space-y-2">
                    {(Object.keys(PACKAGE_CONFIG) as PackageType[]).map(
                      (pkg) => (
                        <button
                          key={pkg}
                          onClick={() => handlePackageChange(pkg)}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                            booking.packageType === pkg
                              ? "border-orange-500 bg-orange-50 shadow-md"
                              : "border-gray-200 hover:border-orange-300 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">
                                {PACKAGE_CONFIG[pkg].icon}
                              </span>
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {PACKAGE_CONFIG[pkg].label}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {PACKAGE_CONFIG[pkg].minSeats ===
                                  PACKAGE_CONFIG[pkg].maxSeats
                                    ? `${PACKAGE_CONFIG[pkg].minSeats} person`
                                    : `${PACKAGE_CONFIG[pkg].minSeats}-${PACKAGE_CONFIG[pkg].maxSeats} people`}
                                </div>
                              </div>
                            </div>
                            {PACKAGE_CONFIG[pkg].discount > 0 && (
                              <div className="bg-green-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm">
                                {PACKAGE_CONFIG[pkg].discount * 100}% OFF
                              </div>
                            )}
                          </div>
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* ============ SEAT SELECTION ============ */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    <UserGroupIcon className="w-4 h-4 inline mr-1" />
                    Number of Travelers
                  </label>
                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                    <button
                      onClick={() =>
                        setBooking({
                          ...booking,
                          seats: Math.max(
                            PACKAGE_CONFIG[booking.packageType].minSeats,
                            booking.seats - 1
                          ),
                        })
                      }
                      disabled={
                        booking.seats <=
                        PACKAGE_CONFIG[booking.packageType].minSeats
                      }
                      className="w-12 h-12 rounded-xl bg-white hover:bg-orange-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 font-bold text-gray-700 transition-all shadow-sm border border-gray-200"
                    >
                      -
                    </button>
                    <div className="flex-1 text-center">
                      <div className="text-3xl font-bold text-gray-900">
                        {booking.seats}
                      </div>
                      <div className="text-xs text-gray-600 font-medium">
                        {booking.packageType === "group"
                          ? "Shared seats"
                          : "Private seats"}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setBooking({
                          ...booking,
                          seats: Math.min(
                            PACKAGE_CONFIG[booking.packageType].maxSeats,
                            booking.seats + 1
                          ),
                        })
                      }
                      disabled={
                        booking.seats >=
                        PACKAGE_CONFIG[booking.packageType].maxSeats
                      }
                      className="w-12 h-12 rounded-xl bg-white hover:bg-orange-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 font-bold text-gray-700 transition-all shadow-sm border border-gray-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* ============ ROOM SELECTION ============ */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-900 mb-3">
                    <HomeIcon className="w-4 h-4 inline mr-1" />
                    Rooms Required
                  </label>
                  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                    <button
                      onClick={() =>
                        setBooking({
                          ...booking,
                          rooms: Math.max(1, booking.rooms - 1),
                        })
                      }
                      disabled={booking.rooms <= 1}
                      className="w-12 h-12 rounded-xl bg-white hover:bg-orange-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 font-bold text-gray-700 transition-all shadow-sm border border-gray-200"
                    >
                      -
                    </button>
                    <div className="flex-1 text-center">
                      <div className="text-3xl font-bold text-gray-900">
                        {booking.rooms}
                      </div>
                      <div className="text-xs text-gray-600 font-medium">
                        Max: {maxRooms} rooms
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setBooking({
                          ...booking,
                          rooms: Math.min(maxRooms, booking.rooms + 1),
                        })
                      }
                      disabled={booking.rooms >= maxRooms}
                      className="w-12 h-12 rounded-xl bg-white hover:bg-orange-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-700 font-bold text-gray-700 transition-all shadow-sm border border-gray-200"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* ============ DATE SELECTION ============ */}
                <div className="mb-6 space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      <CalendarIcon className="w-4 h-4 inline mr-1" />
                      Check-in Date
                    </label>
                    <input
                      type="date"
                      value={booking.checkIn}
                      onChange={(e) =>
                        setBooking({ ...booking, checkIn: e.target.value })
                      }
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      <CalendarIcon className="w-4 h-4 inline mr-1" />
                      Check-out Date
                    </label>
                    <input
                      type="date"
                      value={booking.checkOut}
                      onChange={(e) =>
                        setBooking({ ...booking, checkOut: e.target.value })
                      }
                      min={
                        booking.checkIn ||
                        new Date().toISOString().split("T")[0]
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                  </div>
                </div>

                {/* ============ PRICE BREAKDOWN ============ */}
                <div className="mb-6 p-4 bg-gradient-to-br from-gray-50 to-orange-50 rounded-xl space-y-3 border border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      ₹{pricing.pricePerPerson} × {booking.seats} travelers
                    </span>
                    <span className="font-semibold text-gray-900">
                      ₹{pricing.pricePerPerson * booking.seats}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Accommodation ({booking.rooms} rooms)
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
                  <div className="pt-3 border-t-2 border-gray-300 flex justify-between items-center">
                    <span className="font-bold text-gray-900">
                      Total Amount
                    </span>
                    <span className="font-bold text-3xl text-orange-600">
                      ₹{pricing.total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* ============ BOOK NOW BUTTON ============ */}
                <button
                  disabled={!booking.checkIn || !booking.checkOut}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl text-base transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {!booking.checkIn || !booking.checkOut
                    ? "Select Dates to Continue"
                    : "Book Now - Pay Later"}
                </button>

                <div className="mt-4 flex items-start gap-2 text-xs text-gray-500">
                  <ShieldCheckIcon className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-gray-700">Free Cancellation</strong>{" "}
                    • Reserve now, pay later. Cancel up to 24 hours before for a
                    full refund.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

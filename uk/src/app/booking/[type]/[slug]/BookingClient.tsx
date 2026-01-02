// app/booking/[type]/[slug]/BookingClient.tsx

"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  StarIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  UserGroupIcon,
  HomeIcon,
  CalendarIcon,
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
  description: string;
  location: string;
  rating: number;
  reviewCount: number;
  duration?: string;
  images: string[];
  highlights?: string[];
  includes?: string[];
  type?: string;
  difficulty?: string;
  priceMin: number;
  priceMax: number;
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
  const [selectedImage, setSelectedImage] = useState(0);
  const [booking, setBooking] = useState<BookingState>({
    packageType: "solo",
    seats: 1,
    rooms: 1,
    checkIn: "",
    checkOut: "",
  });

  /* ============ PACKAGE CONFIG ============ */

  const packageConfig = {
    solo: { minSeats: 1, maxSeats: 1, label: "Solo Adventure", discount: 0 },
    family: {
      minSeats: 2,
      maxSeats: 8,
      label: "Family Package",
      discount: 0.1,
    },
    private: {
      minSeats: 8,
      maxSeats: 20,
      label: "Private Group",
      discount: 0.15,
    },
    group: {
      minSeats: 8,
      maxSeats: 50,
      label: "Group (Shared Seats)",
      discount: 0.2,
    },
  };

  /* ============ PRICE CALCULATION ============ */

  const pricing = useMemo(() => {
    const basePrice = data.priceMin;
    const discountRate = packageConfig[booking.packageType].discount;
    const pricePerPerson = basePrice * (1 - discountRate);

    // Room cost (₹500 per room per night)
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
  }, [booking, data.priceMin]);

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

  /* ============ RENDER ============ */

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ============ LEFT COLUMN - MAIN CONTENT ============ */}
          <div className="lg:col-span-2 space-y-6">
            {/* ============ IMAGE GALLERY ============ */}
            <section className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Large Cover Image */}
              <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px]">
                <Image
                  src={data.images[selectedImage]}
                  alt={data.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>

              {/* Thumbnail Grid */}
              <div className="p-4 grid grid-cols-5 gap-2">
                {data.images.slice(0, 5).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === idx
                        ? "border-orange-600 scale-105"
                        : "border-gray-200 hover:border-orange-400"
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

            {/* ============ DETAILS CARD ============ */}
            <section className="bg-white rounded-xl shadow-md p-4 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {data.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="w-4 h-4" />
                      {data.location}
                    </div>
                    {data.duration && (
                      <div className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        {data.duration}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg flex-shrink-0">
                  <span className="text-lg font-bold">{data.rating}</span>
                  <StarIcon className="w-5 h-5" />
                </div>
              </div>

              {/* Type & Difficulty Badges */}
              {type === "activity" && data.type && (
                <div className="mb-4 flex flex-wrap gap-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold text-white ${
                      data.type === "adventure"
                        ? "bg-red-500"
                        : data.type === "spiritual"
                        ? "bg-purple-500"
                        : data.type === "cultural"
                        ? "bg-blue-500"
                        : "bg-green-500"
                    }`}
                  >
                    {data.type.charAt(0).toUpperCase() + data.type.slice(1)}
                  </span>
                  {data.difficulty && (
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gray-200 text-gray-700 capitalize">
                      {data.difficulty}
                    </span>
                  )}
                </div>
              )}

              <p className="text-gray-700 leading-relaxed mb-6">
                {data.description}
              </p>

              {/* Highlights/Includes Section */}
              {((data.highlights && data.highlights.length > 0) ||
                (data.includes && data.includes.length > 0)) && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {type === "activity" ? "What's Included" : "Highlights"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(type === "activity" ? data.includes : data.highlights)?.map(
                      (item, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700 text-sm">{item}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </section>

            {/* ============ AGENCY DETAILS ============ */}
            <section className="bg-white rounded-xl shadow-md p-4 sm:p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                About the {type === "activity" ? "Agency" : "Destination"}
              </h2>
              <div className="flex items-start gap-4">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                  <Image
                    src={
                      data.agency?.logo ||
                      "/default-agency.png"
                    }
                    alt={data.agency?.name || "Agency"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {data.agency?.name || "Sacred Journeys India"}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Verified tour operator • 500+ tours completed
                  </p>
                  <p className="text-gray-700 text-sm">
                    {data.agency?.description ||
                      "Professional tour agency with years of experience in organizing adventure and spiritual tours across India."}
                  </p>
                </div>
              </div>
            </section>

            {/* ============ REVIEWS SECTION - AMAZON STYLE ============ */}
            <section className="bg-white rounded-xl shadow-md p-4 sm:p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Customer Reviews
              </h2>

              {/* Rating Overview */}
              <div className="flex flex-col md:flex-row gap-6 mb-8 pb-8 border-b">
                <div className="text-center md:text-left">
                  <div className="text-5xl font-bold text-gray-900 mb-2">
                    {averageRating}
                  </div>
                  <div className="flex items-center justify-center md:justify-start gap-1 mb-1">
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
                  <p className="text-sm text-gray-600">
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
                      <div key={rating} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 w-12">
                          {rating} star
                        </span>
                        <div className="flex-1 bg-gray-200 rounded-full h-5">
                          <div
                            className="bg-yellow-400 h-5 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12 text-right">
                          {Math.round(percentage)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="space-y-6">
                {reviews.slice(0, 5).map((review) => (
                  <div
                    key={review.id}
                    className="border-b pb-6 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {review.userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {review.userName}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {new Date(review.date).toLocaleDateString("en-IN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
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
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {reviews.length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  No reviews yet. Be the first to review!
                </p>
              )}
            </section>
          </div>

          {/* ============ RIGHT COLUMN - BOOKING FORM (STICKY) ============ */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Book Your {type === "activity" ? "Adventure" : "Journey"}
              </h2>

              {/* ============ PACKAGE SELECTION ============ */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Package
                </label>
                <div className="space-y-2">
                  {(Object.keys(packageConfig) as PackageType[]).map((pkg) => (
                    <button
                      key={pkg}
                      onClick={() =>
                        setBooking({
                          ...booking,
                          packageType: pkg,
                          seats: packageConfig[pkg].minSeats,
                          rooms: 1,
                        })
                      }
                      className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                        booking.packageType === pkg
                          ? "border-orange-600 bg-orange-50"
                          : "border-gray-200 hover:border-orange-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {packageConfig[pkg].label}
                          </div>
                          <div className="text-xs text-gray-600">
                            {packageConfig[pkg].minSeats ===
                            packageConfig[pkg].maxSeats
                              ? `${packageConfig[pkg].minSeats} person`
                              : `${packageConfig[pkg].minSeats}-${packageConfig[pkg].maxSeats} people`}
                          </div>
                        </div>
                        {packageConfig[pkg].discount > 0 && (
                          <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">
                            {packageConfig[pkg].discount * 100}% OFF
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* ============ SEAT SELECTION ============ */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <UserGroupIcon className="w-4 h-4 inline mr-1" />
                  Number of Seats
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setBooking({
                        ...booking,
                        seats: Math.max(
                          packageConfig[booking.packageType].minSeats,
                          booking.seats - 1
                        ),
                      })
                    }
                    disabled={
                      booking.seats <=
                      packageConfig[booking.packageType].minSeats
                    }
                    className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-gray-700 transition-colors"
                  >
                    -
                  </button>
                  <div className="flex-1 text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {booking.seats}
                    </div>
                    <div className="text-xs text-gray-600">
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
                          packageConfig[booking.packageType].maxSeats,
                          booking.seats + 1
                        ),
                      })
                    }
                    disabled={
                      booking.seats >=
                      packageConfig[booking.packageType].maxSeats
                    }
                    className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-gray-700 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* ============ ROOM SELECTION ============ */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <HomeIcon className="w-4 h-4 inline mr-1" />
                  Number of Rooms
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      setBooking({
                        ...booking,
                        rooms: Math.max(1, booking.rooms - 1),
                      })
                    }
                    disabled={booking.rooms <= 1}
                    className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-gray-700 transition-colors"
                  >
                    -
                  </button>
                  <div className="flex-1 text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {booking.rooms}
                    </div>
                    <div className="text-xs text-gray-600">
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
                    className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-gray-700 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* ============ DATE SELECTION ============ */}
              <div className="mb-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
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
                      booking.checkIn || new Date().toISOString().split("T")[0]
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* ============ PRICE BREAKDOWN ============ */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-2 border border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    ₹{pricing.pricePerPerson} × {booking.seats} persons
                  </span>
                  <span className="font-semibold text-gray-900">
                    ₹{pricing.pricePerPerson * booking.seats}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Room cost ({booking.rooms} rooms)
                  </span>
                  <span className="font-semibold text-gray-900">
                    ₹{pricing.roomCost}
                  </span>
                </div>
                {pricing.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Package Discount</span>
                    <span className="font-semibold">-₹{pricing.discount}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-300 flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-2xl text-orange-600">
                    ₹{pricing.total}
                  </span>
                </div>
              </div>

              {/* ============ BOOK NOW BUTTON ============ */}
              <button
                disabled={!booking.checkIn || !booking.checkOut}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-colors shadow-lg hover:shadow-xl text-base"
              >
                Book Now
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                You won't be charged yet. Review details before payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

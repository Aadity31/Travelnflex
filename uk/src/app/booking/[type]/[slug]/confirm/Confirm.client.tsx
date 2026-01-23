"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  MapPinIcon,
  CalendarIcon,
  UserGroupIcon,
  HomeIcon,
  ShareIcon,
  PrinterIcon,
  CheckCircleIcon,
  LockClosedIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { StarIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

interface BookingData {
  name: string;
  image: string;
  location: string;
  selectedDate: string;
  adults: number;
  children: number;
  rooms: number;
  packageType: string;
  pricing: {
    peopleTotal: number;
    roomCost: number;
    discount: number;
    total: number;
  };
}

interface ItineraryDay {
  day: number;
  title: string;
  date: string;
  description: string;
  hotel?: {
    name: string;
    image: string;
    rating: number;
    features: string[];
  };
  activities?: {
    icon: string;
    label: string;
    name: string;
  }[];
  isHighlight?: boolean;
}

export default function BookingConfirmForm({
  bookingData,
}: {
  bookingData: BookingData;
}) {
  const router = useRouter();
  const [showAllDays, setShowAllDays] = useState(false);

  // Dummy itinerary data
  const itinerary: ItineraryDay[] = [
    {
      day: 1,
      title: "Arrival in Haridwar",
      date: "15 Jan 2026",
      description:
        "Arrive at Haridwar. Check-in to your hotel. In the evening, witness the mesmerizing Ganga Aarti at Har Ki Pauri ghat.",
      hotel: {
        name: "Haveli Hari Ganga",
        image: "/images/hotel-1.jpg",
        rating: 4.5,
        features: ["River View", "Breakfast"],
      },
    },
    {
      day: 2,
      title: "Transfer to Barkot",
      date: "16 Jan 2026",
      description:
        "Drive to Barkot via Mussoorie. En route visit Kempty Fall. This is the base for the trek to Yamunotri.",
      hotel: {
        name: "Barkot Camp Resort",
        image: "/images/hotel-2.jpg",
        rating: 4.0,
        features: ["Tent Stay", "Dinner"],
      },
      activities: [
        { icon: "💧", label: "Sightseeing", name: "Kempty Falls" },
        { icon: "🏔️", label: "Stopover", name: "Mussoorie" },
      ],
    },
    {
      day: 3,
      title: "Yamunotri Trek",
      date: "17 Jan 2026",
      description:
        "Early morning drive to Jankichatti. Start 6km trek to Yamunotri. Darshan at the temple and take a holy dip in the hot springs.",
      isHighlight: true,
    },
  ];

  const basePrice = Math.round(bookingData.pricing.total / 1.05);
  const gst = Math.round(bookingData.pricing.total - basePrice);
  const serviceFee = 2000;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 md:px-10 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 flex items-center justify-center text-orange-500">
              <svg
                className="w-7 h-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">TripPlanner</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-6">
              <a
                href="#"
                className="text-sm font-medium text-gray-700 hover:text-orange-500"
              >
                Trips
              </a>
              <a
                href="#"
                className="text-sm font-medium text-gray-700 hover:text-orange-500"
              >
                Support
              </a>
              <a
                href="#"
                className="text-sm font-medium text-gray-700 hover:text-orange-500"
              >
                Sign In
              </a>
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
              JD
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 transition-colors"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Details</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
              Planned Trip Itinerary
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded font-bold text-xs">
                CONFIRMED
              </span>
              <span>•</span>
              <span>Booking ID: #TRP-88219</span>
              <span>•</span>
              <span>
                {new Date(bookingData.selectedDate).toLocaleDateString(
                  "en-IN",
                  { day: "numeric", month: "short", year: "numeric" }
                )}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold hover:bg-gray-50">
              <ShareIcon className="w-4 h-4" />
              Share
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold hover:bg-gray-50">
              <PrinterIcon className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Itinerary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-orange-500" />
                  Route Map: {bookingData.name}
                </h3>
                <span className="text-xs text-gray-500">
                  10 Days / 9 Nights
                </span>
              </div>
              <div className="w-full aspect-video bg-gray-100 relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.257002476564!2d78.1642!3d30.0869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3909dcc202279c09%3A0x7c43b63689cc005!2sRishikesh%2C%20Uttarakhand!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  className="grayscale-[20%] opacity-80"
                />
                <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg border border-gray-200 max-w-xs hidden sm:block">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-xs font-bold text-gray-500 uppercase">
                      Start
                    </span>
                    <span className="text-sm font-bold">Haridwar</span>
                  </div>
                  <div className="h-4 border-l-2 border-dashed border-gray-300 ml-[3px] my-0.5"></div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span className="text-xs font-bold text-gray-500 uppercase">
                      End
                    </span>
                    <span className="text-sm font-bold">Badrinath</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Itinerary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Detailed Itinerary
              </h3>

              <div className="relative pl-4 sm:pl-8 space-y-10">
                <div className="absolute top-2 left-4 sm:left-8 w-0.5 h-[calc(100%-20px)] bg-gray-200 -translate-x-1/2"></div>

                {itinerary.map((day, index) => (
                  <div key={day.day} className="relative">
                    <div
                      className={`absolute top-0 left-0 sm:-left-8 -translate-x-1/2 ${
                        index === 0
                          ? "bg-orange-500 text-white"
                          : "bg-white border-2 border-orange-500 text-orange-500"
                      } w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 ring-4 ring-white`}
                    >
                      {day.day}
                    </div>

                    <div className="pl-6 sm:pl-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                        <h4 className="text-lg font-bold text-gray-900">
                          {day.title}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {day.date}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {day.description}
                      </p>

                      {/* Activities */}
                      {day.activities && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                          {day.activities.map((activity, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-3 p-2 bg-white rounded border border-gray-200"
                            >
                              <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-orange-500 text-xl">
                                {activity.icon}
                              </div>
                              <div>
                                <div className="text-xs font-bold text-gray-500">
                                  {activity.label}
                                </div>
                                <div className="text-sm font-semibold">
                                  {activity.name}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Highlight Badge */}
                      {day.isHighlight && (
                        <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg border border-orange-100 mb-4">
                          <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xl">
                            🕉️
                          </div>
                          <div>
                            <div className="text-sm font-bold text-orange-800">
                              Yamunotri Temple Darshan
                            </div>
                            <div className="text-xs text-orange-700/70">
                              Priority pass included in your package
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Hotel */}
                      {day.hotel && (
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 flex gap-4 items-start">
                          <div className="w-20 h-20 shrink-0 rounded-md overflow-hidden bg-gray-200">
                            <Image
                              src={day.hotel.image}
                              alt={day.hotel.name}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <span className="text-[10px] font-bold tracking-wider text-gray-500 uppercase mb-1 block">
                              Night Stay
                            </span>
                            <h5 className="font-bold text-sm text-gray-900 mb-1">
                              {day.hotel.name}
                            </h5>
                            <div className="flex items-center gap-1 mb-2">
                              <div className="flex text-amber-400">
                                {[...Array(Math.floor(day.hotel.rating))].map(
                                  (_, i) => (
                                    <StarIcon key={i} className="w-3 h-3" />
                                  )
                                )}
                              </div>
                              <span className="text-xs text-gray-500">
                                ({day.hotel.rating})
                              </span>
                            </div>
                            <div className="flex gap-2">
                              {day.hotel.features.map((feature, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-600"
                                >
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Show More Button */}
                <div className="relative">
                  <div className="absolute top-0 left-0 sm:-left-8 -translate-x-1/2 bg-gray-200 text-gray-500 w-8 h-8 rounded-full flex items-center justify-center z-10 ring-4 ring-white">
                    <ChevronDownIcon className="w-4 h-4" />
                  </div>
                  <div className="pl-6 sm:pl-0 pt-1">
                    <button
                      onClick={() => setShowAllDays(!showAllDays)}
                      className="text-sm font-bold text-orange-500 hover:underline"
                    >
                      View remaining 7 days
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhance Your Trip */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Enhance Your Trip
                </h3>
                <a
                  href="#"
                  className="text-xs font-bold text-orange-500 hover:underline"
                >
                  View All
                </a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    name: "Helicopter Service",
                    desc: "Kedarnath shuttle service",
                    price: "4,500",
                    image: "/images/heli.jpg",
                  },
                  {
                    name: "Special Puja",
                    desc: "Personalized ritual at Badrinath",
                    price: "2,100",
                    image: "/images/puja.jpg",
                  },
                ].map((addon, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors cursor-pointer group"
                  >
                    <div className="w-16 h-16 rounded overflow-hidden shrink-0 bg-gray-200">
                      <Image
                        src={addon.image}
                        alt={addon.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-bold text-gray-900 group-hover:text-orange-500 transition-colors">
                        {addon.name}
                      </h5>
                      <p className="text-xs text-gray-500 mb-2">{addon.desc}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">
                          ₹{addon.price}
                        </span>
                        <button className="text-[10px] font-bold text-orange-500 border border-orange-500 px-2 py-0.5 rounded hover:bg-orange-500 hover:text-white transition-colors">
                          ADD
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 sticky top-6">
              <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-4">
                <div className="w-10 h-10 rounded bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Payment Summary
                  </h2>
                  <p className="text-gray-500 text-xs">
                    Complete payment to finalize
                  </p>
                </div>
              </div>

              <div className="mb-6 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Package</span>
                  <span className="font-bold text-gray-900">
                    {bookingData.name}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Dates</span>
                  <span className="font-bold text-gray-900">
                    {new Date(bookingData.selectedDate).toLocaleDateString(
                      "en-IN",
                      { day: "numeric", month: "short" }
                    )}{" "}
                    - 24 Jan 2026
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Travelers</span>
                  <span className="font-bold text-gray-900">
                    {bookingData.adults} Adult
                    {bookingData.adults > 1 ? "s" : ""}
                    {bookingData.children > 0 &&
                      ` + ${bookingData.children} Child${
                        bookingData.children > 1 ? "ren" : ""
                      }`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Room Type</span>
                  <span className="font-bold text-gray-900">
                    {bookingData.rooms} x Double Sharing
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-500">Base Price</span>
                  <span className="text-sm font-semibold text-gray-900">
                    ₹{basePrice.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-gray-500">
                    Taxes & GST (5%)
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    ₹{gst.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-3 pb-3 border-b border-dashed border-gray-300">
                  <span className="text-xs text-gray-500">Service Fee</span>
                  <span className="text-sm font-semibold text-gray-900">
                    ₹{serviceFee.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total Amount</span>
                  <span className="font-bold text-xl text-orange-500">
                    ₹{bookingData.pricing.total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <button className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold shadow-lg transition-all flex items-center justify-center mb-4 gap-2">
                <LockClosedIcon className="w-5 h-5" />
                <span>Pay Now & Confirm</span>
              </button>

              <div className="text-center">
                <p className="text-xs text-gray-400 mb-2">
                  Secure payment powered by Razorpay
                </p>
                <div className="flex justify-center gap-2 opacity-60 grayscale">
                  <div className="h-4 w-8 bg-gray-300 rounded"></div>
                  <div className="h-4 w-8 bg-gray-300 rounded"></div>
                  <div className="h-4 w-8 bg-gray-300 rounded"></div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  Need Help?
                </h4>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-orange-500">
                    <PhoneIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">
                      Call our travel expert
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      +91 98765 43210
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-200 py-6 bg-white text-center mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2026 TripPlanner Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-orange-500 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-orange-500 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-orange-500 transition-colors">
              Sitemap
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

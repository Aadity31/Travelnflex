"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeftIcon,
  ShareIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";

import MapSection from "@/components/confirm_booking/MapSection";
import ItinerarySection from "@/components/confirm_booking/ItinerarySection";
import EnhanceTrip from "@/components/confirm_booking/EnhanceTrip";
import PaymentSummary from "@/components/confirm_booking/PaymentSummary";

/* ---------------- TYPES ---------------- */

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

/* ---------------- COMPONENT ---------------- */

export default function BookingConfirmForm({
  bookingData,
}: {
  bookingData: BookingData;
}) {
  const router = useRouter();
  const [showAllDays, setShowAllDays] = useState(false);

  // Dummy itinerary data (same as before)
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
            <MapSection name={bookingData.name} />

            {/* Detailed Itinerary */}
            <ItinerarySection
              itinerary={itinerary}
              showAllDays={showAllDays}
              setShowAllDays={setShowAllDays}
            />

            {/* Enhance Your Trip */}
            <EnhanceTrip />
          </div>

          {/* Right Column - Payment Summary */}
          <div className="lg:col-span-1">
            <PaymentSummary
              bookingData={bookingData}
              basePrice={basePrice}
              gst={gst}
              serviceFee={serviceFee}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

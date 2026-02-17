"use client";

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
import type { ItineraryDay as DBItineraryDay } from "@/lib/db/getItineraryWithActivities";

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
  location?: string;
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
  startTime?: string;
  endTime?: string;
}

/* ---------------- DEFAULT ITINERARY DATA ---------------- */

const defaultItinerary: ItineraryDay[] = [
  {
    day: 1,
    title: "Arrival in Haridwar",
    location: "Haridwar",
    date: "15 Jan 2026",
    description:
      "Arrive at Haridwar. Check-in to your hotel. In the evening, witness the Ganga Aarti at Har Ki Pauri.",
    hotel: {
      name: "Haveli Hari Ganga",
      image: "/images/hotel-1.jpg",
      rating: 4.5,
      features: ["River View", "Breakfast"],
    },
  },
  {
    day: 2,
    title: "Haridwar to Barkot",
    location: "Barkot",
    date: "16 Jan 2026",
    description:
      "Drive to Barkot via Mussoorie. En route visit Kempty Falls. Overnight stay at Barkot.",
    hotel: {
      name: "Barkot Camp Resort",
      image: "/images/hotel-2.jpg",
      rating: 4.0,
      features: ["Tent Stay", "Dinner"],
    },
    activities: [
      { icon: "💧", label: "Sightseeing", name: "Kempty Falls" },
      { icon: "🏔️", label: "Hill Town", name: "Mussoorie" },
    ],
  },
  {
    day: 3,
    title: "Yamunotri Trek",
    location: "Yamunotri",
    date: "17 Jan 2026",
    description:
      "Early morning drive to Jankichatti. Start 6 km trek to Yamunotri. Temple darshan and Surya Kund bath.",
    isHighlight: true,
  },
  {
    day: 4,
    title: "Barkot to Uttarkashi",
    location: "Uttarkashi",
    date: "18 Jan 2026",
    description:
      "Drive to Uttarkashi. Visit Vishwanath Temple and relax near Bhagirathi River.",
    hotel: {
      name: "Hotel Shiv Ganga",
      image: "/images/hotel-3.jpg",
      rating: 4.1,
      features: ["River Side", "WiFi"],
    },
  },
  {
    day: 5,
    title: "Gangotri Excursion",
    location: "Gangotri",
    date: "19 Jan 2026",
    description:
      "Early morning drive to Gangotri. Perform pooja and enjoy scenic Himalayan views. Return to Uttarkashi.",
    isHighlight: true,
  },
  {
    day: 6,
    title: "Uttarkashi to Guptkashi",
    location: "Guptkashi",
    date: "20 Jan 2026",
    description:
      "Long scenic drive to Guptkashi via Tehri Dam and Rudraprayag. Overnight stay.",
    hotel: {
      name: "Guptkashi Heights",
      image: "/images/hotel-4.jpg",
      rating: 4.0,
      features: ["Mountain View", "Dinner"],
    },
  },
  {
    day: 7,
    title: "Kedarnath Trek",
    location: "Kedarnath",
    date: "21 Jan 2026",
    description:
      "Drive to Sonprayag, then trek 16 km to Kedarnath. Evening aarti at Kedarnath Temple.",
    isHighlight: true,
  },
  {
    day: 8,
    title: "Kedarnath to Guptkashi",
    location: "Guptkashi",
    date: "22 Jan 2026",
    description:
      "Morning darshan at Kedarnath Temple. Trek back to Sonprayag and drive to Guptkashi.",
  },
  {
    day: 9,
    title: "Guptkashi to Badrinath",
    location: "Badrinath",
    date: "23 Jan 2026",
    description:
      "Drive to Badrinath via Joshimath. Visit Tapt Kund and attend evening aarti.",
    hotel: {
      name: "Hotel Snow Crest",
      image: "/images/hotel-5.jpg",
      rating: 4.3,
      features: ["Heater", "Hot Water"],
    },
  },
  {
    day: 10,
    title: "Badrinath to Haridwar (Departure)",
    location: "Haridwar",
    date: "24 Jan 2026",
    description:
      "Morning darshan at Badrinath Temple. Drive back to Haridwar with memorable experiences.",
    isHighlight: true,
  },
];

/* ---------------- COMPONENT ---------------- */

interface BookingConfirmFormProps {
  bookingData: BookingData;
  intentId?: string;
  isIntentValid?: boolean;
  itineraryDays?: DBItineraryDay[];
}

export default function BookingConfirmForm({
  bookingData,
  intentId,
  isIntentValid = true,
  itineraryDays = [],
}: BookingConfirmFormProps) {
  const router = useRouter();

  // Transform database itinerary data to UI format
  const itinerary: ItineraryDay[] = itineraryDays.length > 0
    ? itineraryDays.map((day, index) => {
        // Calculate date based on start date from booking data
        const startDate = new Date(bookingData.selectedDate);
        const dayDate = new Date(startDate);
        dayDate.setDate(startDate.getDate() + index);
        
        return {
          day: day.dayNumber,
          title: day.title,
          location: day.location || undefined,
          date: dayDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
          description: day.description || "",
          activities: day.activities.map((act) => ({
            icon: "",
            label: "Activity",
            name: act.activityName,
          })),
          startTime: day.startTime || undefined,
          endTime: day.endTime || undefined,
        };
      })
    : defaultItinerary;

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
              <span className={`px-2 py-0.5 rounded font-bold text-xs ${
                !isIntentValid 
                  ? "bg-red-100 text-red-600" 
                  : intentId 
                    ? "bg-amber-100 text-amber-600" 
                    : "bg-blue-100 text-blue-600"
              }`}>
                {!isIntentValid ? 'EXPIRED' : intentId ? 'PENDING' : 'CONFIRMED'}
              </span>
              <span>•</span>
              <span>Booking ID: {intentId || 'TRP-' + Date.now().toString().slice(-8)}</span>
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
            <MapSection name={bookingData.name} locations={itinerary.map(d => d.location).filter(Boolean) as string[]} />

            {/* Detailed Itinerary */}
            <ItinerarySection
              itinerary={itinerary}
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

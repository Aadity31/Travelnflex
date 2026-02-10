import { getActivityBySlug } from "@/lib/data/activities/getActivityBySlug";
import { getDestinationBySlug } from "@/lib/data/destinations/getDestinationBySlug";
import { getItineraryByDestinationSlug, type ItineraryDay } from "@/lib/db/getItineraryWithActivities";
import { notFound } from "next/navigation";
import BookingConfirmForm from "./Confirm.client";



interface PageProps {
  params: Promise<{
    type: string;
    slug: string;
  }>;
  searchParams: Promise<{
    ref?: string; // Booking intent ID
    selectedDate?: string;
    adults?: string;
    children?: string;
    rooms?: string;
    packageType?: string;
    availableSlots?: string;
    peopleTotal?: string;
    roomCost?: string;
    discount?: string;
    total?: string;
  }>;
}

export default async function BookingConfirmPage({
  params,
  searchParams,
}: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const { type, slug } = resolvedParams;
  const { ref: intentId } = resolvedSearchParams;

  // Validate type
  if (type !== "activity" && type !== "destination") {
    notFound();
  }

  // Fetch the activity/destination data
  const data =
    type === "activity"
      ? await getActivityBySlug(slug)
      : await getDestinationBySlug(slug);

  if (!data) {
    notFound();
  }

  // Validate intent if ref is provided
  let isIntentValid = false;
  if (intentId) {
    try {
      const intentRes = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/booking/create-intent?intent_id=${encodeURIComponent(intentId)}`
      );
      if (intentRes.ok) {
        const intentData = await intentRes.json();
        isIntentValid = intentData.status !== 'EXPIRED';
      }
    } catch (error) {
      console.error("Failed to validate intent:", error);
    }
  }

  // Parse and validate booking data from URL params
  const selectedDate = resolvedSearchParams.selectedDate;
  const adults = parseInt(resolvedSearchParams.adults || "0");
  const children = parseInt(resolvedSearchParams.children || "0");
  const rooms = parseInt(resolvedSearchParams.rooms || "0");
  const packageType = resolvedSearchParams.packageType || "solo";

  // Allow access without search params if intent is valid
  const hasBookingParams = selectedDate && adults > 0;

  // Construct booking data object
  const bookingData = hasBookingParams ? {
    name: data.name,
    image:
      data.images && data.images.length > 0
        ? data.images[0]
        : "/placeholder-image.jpg",
    location: data.location,
    selectedDate,
    adults,
    children,
    rooms,
    packageType,
    pricing: {
      peopleTotal: parseInt(resolvedSearchParams.peopleTotal || "0"),
      roomCost: parseInt(resolvedSearchParams.roomCost || "0"),
      discount: parseInt(resolvedSearchParams.discount || "0"),
      total: parseInt(resolvedSearchParams.total || "0"),
    },
  } : {
    // Default values for direct navigation
    name: data.name,
    image:
      data.images && data.images.length > 0
        ? data.images[0]
        : "/placeholder-image.jpg",
    location: data.location,
    selectedDate: selectedDate || new Date().toISOString().split('T')[0],
    adults: adults || 1,
    children: children || 0,
    rooms: rooms || 1,
    packageType: packageType,
    pricing: {
      peopleTotal: data.priceMin || 0,
      roomCost: 0,
      discount: 0,
      total: data.priceMin || 0,
    },
  };

  // Fetch itinerary data for destinations
  let itineraryDays: ItineraryDay[] = [];
  if (type === "destination" && data.id) {
    const itineraryData = await getItineraryByDestinationSlug(slug);
    if (itineraryData?.days) {
      itineraryDays = itineraryData.days;
    }
  }

  return (
    <BookingConfirmForm 
      bookingData={bookingData} 
      intentId={intentId} 
      isIntentValid={isIntentValid}
      itineraryDays={itineraryDays}
    />
  );
}

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const { type, slug } = resolvedParams;

  const data =
    type === "activity"
      ? await getActivityBySlug(slug)
      : await getDestinationBySlug(slug);

  if (!data) {
    return {
      title: "Booking Confirmation",
    };
  }

  return {
    title: `Confirm Booking - ${data.name} | TripPlanner`,
    description: `Complete your booking for ${data.name}. Review your itinerary and make payment.`,
  };
}




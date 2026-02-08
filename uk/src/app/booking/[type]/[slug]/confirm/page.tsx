import { getActivityBySlug } from "@/lib/data/activities/getActivityBySlug";
import { getDestinationBySlug } from "@/lib/data/destinations/getDestinationBySlug";
import { notFound } from "next/navigation";
import BookingConfirmForm from "./Confirm.client";



interface PageProps {
  params: {
    type: string;
    slug: string;
  };
  searchParams: {
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
  };
}

export default async function BookingConfirmPage({
  params,
  searchParams,
}: PageProps) {
  const { type, slug } = params;

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

  // Parse and validate booking data from URL params
  const selectedDate = searchParams.selectedDate;
  const adults = parseInt(searchParams.adults || "0");
  const children = parseInt(searchParams.children || "0");
  const rooms = parseInt(searchParams.rooms || "0");
  const packageType = searchParams.packageType || "standard";

  // Allow access without search params for direct navigation
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
      peopleTotal: parseInt(searchParams.peopleTotal || "0"),
      roomCost: parseInt(searchParams.roomCost || "0"),
      discount: parseInt(searchParams.discount || "0"),
      total: parseInt(searchParams.total || "0"),
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
    adults: 1,
    children: 0,
    rooms: 1,
    packageType: "solo",
    pricing: {
      peopleTotal: data.priceMin || 0,
      roomCost: 0,
      discount: 0,
      total: data.priceMin || 0,
    },
  };

  return <BookingConfirmForm bookingData={bookingData} />;
}

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps) {
  const { type, slug } = params;

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




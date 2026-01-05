import { getActivityBySlug } from "@/lib/db/getActivityBySlug";
import { getDestinationBySlug } from "@/lib/db/getDestinationBySlug";
import { notFound } from "next/navigation";
import BookingConfirmForm from "./BookingConfirmForm.tsx";

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

  // Validate required fields
  if (!selectedDate || adults === 0) {
    notFound();
  }

  // Parse pricing data
  const peopleTotal = parseInt(searchParams.peopleTotal || "0");
  const roomCost = parseInt(searchParams.roomCost || "0");
  const discount = parseInt(searchParams.discount || "0");
  const total = parseInt(searchParams.total || "0");

  // Construct booking data object
  const bookingData = {
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
      peopleTotal,
      roomCost,
      discount,
      total,
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

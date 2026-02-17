// app/booking/[type]/[slug]/page.tsx

import { notFound } from "next/navigation";
import { getActivityBySlug } from "@/lib/data/activities/getActivityBySlug";
import { getActivityAvailableDates } from "@/lib/data/activities/getAvailableDates";
import { getDestinationBySlug } from "@/lib/data/destinations/getDestinationBySlug";
import { getAvailableDatesByDestination } from "@/lib/data/destinations/getAvailableDates";
import { getReviews } from "@/lib/data/reviews/getReviews";
import BookingClient from "./Booking.client";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;  // ✅ Promise type
}) {
  const { type, slug } = await params;  // ✅ await params

  let data;
  let reviews;
  let availableDates: Record<string, number> = {};

  if (type === 'activity') {
    data = await getActivityBySlug(slug);
    reviews = await getReviews({ slug, type: 'activity' });
    // Fetch available dates for activity
    if (data?.id) {
      availableDates = await getActivityAvailableDates(data.id);
    }
  } else if (type === 'destination') {
    data = await getDestinationBySlug(slug);
    reviews = await getReviews({ slug, type: 'destination' });
    // Fetch available dates for destination (solo traveler by default)
    if (data?.id) {
      availableDates = await getAvailableDatesByDestination(data.id, 'solo_traveler');
    }
  } else {
    notFound();
  }

  if (!data) {
    notFound();
  }

  return <BookingClient data={data} reviews={reviews} type={type} availableDates={availableDates} />;
}

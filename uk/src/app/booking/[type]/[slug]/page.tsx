// app/booking/[type]/[slug]/page.tsx

import { notFound } from "next/navigation";
import { getActivityBySlug } from "@/lib/data/activities/getActivityBySlug";
import { getDestinationBySlug } from "@/lib/data/destinations/getDestinationBySlug";
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

  if (type === 'activity') {
    data = await getActivityBySlug(slug);
    reviews = await getReviews({ slug, type: 'activity' });
  } else if (type === 'destination') {
    data = await getDestinationBySlug(slug);
    reviews = await getReviews({ slug, type: 'destination' });
  } else {
    notFound();
  }

  if (!data) {
    notFound();
  }

  return <BookingClient data={data} reviews={reviews} type={type} />;
}

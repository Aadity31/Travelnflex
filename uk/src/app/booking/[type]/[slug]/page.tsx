// app/booking/[type]/[slug]/page.tsx

import { notFound } from "next/navigation";
import { getActivityBySlug } from "@/lib/db/getActivityBySlug";
import { getDestinationBySlug } from "@/lib/db/getDestinationBySlug";
import { getReviews } from "@/lib/db/getReviews";
import BookingClient from "./BookingClient";

export default async function BookingPage({
  params,
}: {
  params: { type: string; slug: string };
}) {
  const { type, slug } = params;

  let data;
  let reviews;

  if (type === 'activity') {
    data = await getActivityBySlug(slug);
    reviews = await getReviews({ slug, type: 'activity' });
  } else if (type === 'destination') {
    data = await getDestinationBySlug(slug);
    reviews = await getReviews({ slug, type: 'destination' });
  } else {
    notFound(); // Invalid type
  }

  if (!data) {
    notFound(); // Data not found
  }

  return <BookingClient data={data} reviews={reviews} type={type} />;
}

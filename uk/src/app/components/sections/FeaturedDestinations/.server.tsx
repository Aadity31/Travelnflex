import { getFeaturedDestinations } from "@/lib/db/getFeaturedDestinations";
import FeaturedDestinationsClient from "./.client";

export default async function FeaturedDestinationsServer() {
  const destinations = await getFeaturedDestinations(6);

  return <FeaturedDestinationsClient destinations={destinations} />;
}

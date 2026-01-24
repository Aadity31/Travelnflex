import { getFeaturedDestinations } from "@/lib/data/destinations/getFeaturedDestinations";
import FeaturedDestinationsClient from "./FeaturedDestinations.client";

export default async function FeaturedDestinationsServer() {
  const destinations = await getFeaturedDestinations(6);

  return <FeaturedDestinationsClient destinations={destinations} />;
}

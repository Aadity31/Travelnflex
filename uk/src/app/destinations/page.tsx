import { Metadata } from "next";
import DestinationsClient from "./Destinations.client";
import { getDestinationsList } from "@/lib/db/getDestinationsList";

export const metadata: Metadata = {
  title: "Sacred Destinations - Explore Uttarakhand | Sacred Journeys",
  description:
    "Explore sacred destinations of Uttarakhand including Rishikesh, Haridwar, Kedarnath, Badrinath and more.",
  keywords:
    "Uttarakhand destinations, Rishikesh travel, Haridwar tourism, Char Dham, spiritual journeys",
};

export default async function DestinationsPage() {
  // 🔒 ALWAYS ARRAY (TS safe)
  const initialDestinations =
    (await getDestinationsList({ limit: 6 })) ?? [];

  // 🔑 SEO structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: initialDestinations.map((destination, index) => ({
      "@type": "TouristDestination",
      position: index + 1,
      name: destination.name,
      description: destination.shortDescription,
      image: destination.image,
      address: {
        "@type": "PostalAddress",
        addressLocality: destination.location,
      },
    })),
  };

  return (
    <>
      {/* SEO STRUCTURED DATA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      {/* CLIENT RENDER */}
      <DestinationsClient initialDestinations={initialDestinations} />
    </>
  );
}

import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { StarIcon, MapPinIcon, ClockIcon } from "@heroicons/react/24/solid";
import type { Destination } from "../types";

export const metadata: Metadata = {
  title: "Sacred Destinations - Explore Rishikesh & Haridwar | Sacred Journeys",
  description:
    "Explore sacred destinations in Uttarakhand. Visit Rishikesh for yoga & adventure, Haridwar for Ganga Aarti. Book guided tours with local experts today!",
  keywords:
    "Rishikesh destinations, Haridwar attractions, spiritual tours, yoga capital, Ganga Aarti",
};

// Mock data - In real app, this would come from API/database
const destinations: Destination[] = [
  {
    id: "rishikesh",
    name: "Rishikesh",
    slug: "rishikesh",
    shortDescription:
      'Known as the "Yoga Capital of the World," Rishikesh offers the perfect blend of spirituality and adventure.',
    description:
      'Nestled in the foothills of the Himalayas along the banks of the holy Ganges, Rishikesh is globally recognized as the "Yoga Capital of the World" and offers an extraordinary blend of spiritual enlightenment and thrilling adventures.',
    image: "/images/rishikesh-overview.jpg",
    gallery: ["/images/rishikesh-1.jpg", "/images/rishikesh-2.jpg"],
    highlights: [
      "World-renowned yoga centers and ashrams",
      "White-water rafting on the Ganges",
      "Iconic suspension bridges - Laxman Jhula and Ram Jhula",
      "Evening Ganga Aarti at Triveni Ghat",
    ],
    location: {
      coordinates: [30.0869, 78.2676],
      address: "Rishikesh, Uttarakhand, India",
    },
    bestTimeToVisit: "October to February",
    averageRating: 4.8,
    reviewCount: 1250,
    activities: [],
  },
  {
    id: "haridwar",
    name: "Haridwar",
    slug: "haridwar",
    shortDescription:
      "One of India's seven holiest cities, where the Ganges descends from the Himalayas to the plains.",
    description:
      "One of India's seven holiest cities, Haridwar is where the Ganges descends from the Himalayas to the plains. Experience divine ceremonies, ancient temples, and sacred rituals.",
    image: "/images/haridwar-overview.jpg",
    gallery: ["/images/haridwar-1.jpg", "/images/haridwar-2.jpg"],
    highlights: [
      "Magnificent Ganga Aarti at Har Ki Pauri",
      "Ancient temples: Mansa Devi, Chandi Devi",
      "Sacred bathing ghats along the Ganges",
      "Kumbh Mela pilgrimage site",
    ],
    location: {
      coordinates: [29.9457, 78.1642],
      address: "Haridwar, Uttarakhand, India",
    },
    bestTimeToVisit: "October to March",
    averageRating: 4.7,
    reviewCount: 980,
    activities: [],
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: destinations.map((destination, index) => ({
    "@type": "TouristDestination",
    position: index + 1,
    name: destination.name,
    description: destination.description,
    image: destination.image,
    address: {
      "@type": "PostalAddress",
      addressLocality: destination.location.address,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: destination.location.coordinates[0],
      longitude: destination.location.coordinates[1],
    },
  })),
};

export default function DestinationsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="min-h-screen bg-gray-50">
        {/* Hero Section - Compact */}
        <section className="relative h-48 bg-gradient-to-r from-orange-600 to-red-600 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Sacred Destinations
            </h1>
            <p className="text-base md:text-lg max-w-2xl mx-auto">
              Explore the spiritual heartland of India
            </p>
          </div>
        </section>

        {/* Destinations Grid - Compact */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {destinations.map((destination) => (
              <article
                key={destination.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-48">
                  <Image
                    src={destination.image}
                    alt={destination.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1">
                    <StarIcon className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="font-semibold text-sm">
                      {destination.averageRating}
                    </span>
                    <span className="text-gray-600 text-xs">
                      ({destination.reviewCount})
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-gray-600 mb-2">
                    <MapPinIcon className="w-3.5 h-3.5" />
                    <span className="text-xs">
                      {destination.location.address}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {destination.name}
                  </h2>

                  <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                    {destination.shortDescription}
                  </p>

                  <div className="mb-5">
                    <h3 className="font-semibold text-gray-900 text-sm mb-2">
                      Highlights:
                    </h3>
                    <ul className="space-y-1.5">
                      {destination.highlights
                        .slice(0, 3)
                        .map((highlight, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-xs text-gray-700"
                          >
                            <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 flex-shrink-0" />
                            {highlight}
                          </li>
                        ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <ClockIcon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Best: </span>
                      {destination.bestTimeToVisit}
                    </div>

                    <Link
                      href={`/destinations/${destination.slug}`}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200"
                    >
                      Explore
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CTA Section - Compact */}
        <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-12">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Ready to Begin Your Sacred Journey?
            </h2>
            <p className="text-base md:text-lg mb-6">
              Let our expert local guides create unforgettable experiences
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-orange-600 px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Contact Guide
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

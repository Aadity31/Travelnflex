"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { StarIcon, MapPinIcon, ClockIcon } from "@heroicons/react/24/solid";
import { useLoading } from "@/lib/use-loading";

/* ---------------- TYPES (LOGIC ONLY) ---------------- */

export interface DestinationCard {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  image: string;
  location: string;
  rating: number;
  reviewCount: number;
  highlights?: string[];
  bestTimeToVisit?: string;
  createdAt: string; // cursor
}

/* ---------------- COMPONENT ---------------- */

export default function DestinationsClient({
  initialDestinations,
}: {
  initialDestinations: DestinationCard[];
}) {
  /* -------- LOGIC STATE (UI SEPARATE) -------- */

  const [destinations, setDestinations] = useState<DestinationCard[]>(
    initialDestinations ?? []
  );

  const [cursor, setCursor] = useState<{
    createdAt: string;
    id: string;
  } | null>(() => {
    const last = initialDestinations?.at(-1);
    return last ? { createdAt: last.createdAt, id: last.id } : null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const { showLoading } = useLoading();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  /* ---------------- INFINITE SCROLL LOGIC ---------------- */

  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || isLoading) return;

        setIsLoading(true);

        try {
          const url = cursor
            ? `/api/destinations?createdAt=${encodeURIComponent(
                cursor.createdAt
              )}&id=${encodeURIComponent(cursor.id)}`
            : `/api/destinations`;

          const res = await fetch(url);
          if (!res.ok) throw new Error("API failed");

          const next: DestinationCard[] = await res.json();

          if (next.length === 0) {
            setHasMore(false);
            return;
          }

          const last = next.at(-1);

          setDestinations((prev) => [...prev, ...next]);
          setCursor(last ? { createdAt: last.createdAt, id: last.id } : null);
        } catch (err) {
          console.error("Destinations infinite scroll failed:", err);
          setHasMore(false);
        } finally {
          setIsLoading(false);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [cursor, hasMore, isLoading]);

  /* ---------------- UI (100% SAME AS YOUR PAGE) ---------------- */

  return (
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
                    {destination.rating}
                  </span>
                  <span className="text-gray-600 text-xs">
                    ({destination.reviewCount})
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-1.5 text-gray-600 mb-2">
                  <MapPinIcon className="w-3.5 h-3.5" />
                  <span className="text-xs">{destination.location}</span>
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
                    {(destination.highlights ?? [])
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

        {/* Infinite scroll trigger */}
        <div ref={loaderRef} className="h-10" />

        {isLoading && (
          <div className="text-center py-6 text-gray-500">
            Loading more destinations…
          </div>
        )}
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
  );
}

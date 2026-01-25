export const dynamic = "force-dynamic";

import { Metadata } from "next";
import HeroSection from "@/components/sections/Hero/HeroSection";
import QuickSearchBar from "@/components/search/QuickSearchBar";
import FeaturedDestinations from "@/components/sections/FeaturedDestinations/FeaturedDestinations.server";
import TopActivities from "@/components/sections/TopActivities/TopActivities.server";
import TestimonialsSection from "@/components/sections/Testimonials/TestimonialsSection";
import FeaturedGuides from "@/components/sections/Featured/FeaturedGuides";
import CTASection from "@/components/sections/CTA/CTASection";
import FooterWithCredits from "@/components/Footer";

export const metadata: Metadata = {
  title: "Sacred Journeys - Spiritual & Adventure Travel in Uttrakhand,",
  description:
    "Discover uttrakhand uk with expert local guides. Book spiritual journeys, adventure activities, and Ganga Aarti tours. Save up to 30% on customized packages!",
  keywords:
    "Uttrakhand travel, uk , Char Dham,Rishikesh travel, Haridwar tours, Ganga Aarti, yoga retreats, river rafting, spiritual journey, local guides",
  openGraph: {
    title: "Sacred Journeys - Spiritual & Adventure Travel",
    description:
      "Experience the spiritual heart of India with expert local guides",
    images: ["/images/hero-rishikesh.jpg"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Sacred Journeys",
  description:
    "Certified local guides for spiritual and adventure experiences in Rishikesh and Haridwar",
  url: "https://devbhoomi-darshan.apsgroupco.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Near Ram Jhula",
    addressLocality: "Rishikesh",
    addressRegion: "Uttarakhand",
    postalCode: "249201",
    addressCountry: "India",
  },
  telephone: "+91-9876543210",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "500",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="min-h-screen">
        <HeroSection />
        <QuickSearchBar />
        <FeaturedDestinations />
        <TopActivities />
        <FeaturedGuides />
        <TestimonialsSection />
        <CTASection />
        <FooterWithCredits />
      </main>
    </>
  );
}

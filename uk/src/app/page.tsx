import { Metadata } from "next";
import HeroSection from "./components/sections/HeroSection";
import QuickSearchBar from "./components/search/QuickSearchBar";
import FeaturedDestinations from "./components/sections/FeaturedDestinations";
import TopActivities from "./components/sections/TopActivities";
import TestimonialsSection from "./components/sections/TestimonialsSection";
import FeaturedGuides from "./components/sections/FeaturedGuides";
import CTASection from "./components/sections/CTASection";
import FooterWithCredits from "./components/Footer";

export const metadata: Metadata = {
  title:
    "Sacred Journeys - Spiritual & Adventure Travel in Rishikesh & Haridwar",
  description:
    "Discover Rishikesh & Haridwar with expert local guides. Book spiritual journeys, adventure activities, and Ganga Aarti tours. Save up to 30% on customized packages!",
  keywords:
    "Rishikesh travel, Haridwar tours, Ganga Aarti, yoga retreats, river rafting, spiritual journey, local guides",
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
  url: "https://sacredjourneys.com",
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

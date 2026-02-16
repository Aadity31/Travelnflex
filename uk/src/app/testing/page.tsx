'use client';

import AboutSection from '@/components/booking/activityComp/AboutSection';
import BookingSidebar from '@/components/booking/activityComp/BookingSidebar';
import HighlightsSection from '@/components/booking/activityComp/HighlightsSection';
import IncludedSection from '@/components/booking/activityComp/IncludedSection';
import { RecommendedActivities } from '@/components/booking/RecommendedActivities'
import { ReviewsSection } from '@/components/booking/ReviewsSection';
import React, { useEffect, useState } from 'react';
import HeroWithGallery from '@/components/booking/activityComp/HeroGallerySection';

interface Activity {
  id: string;
  name: string;
  slug: string;
  type: string;
  description: string;
  shortDescription: string;
  duration: string;
  location: string;
  difficulty: string;
  rating: number;
  reviewCount: number;
  maxGroupSize: number;
  coverImage: string;
  images: string[];
  galleryImages: string[];
  highlights: string[];
  includes: string[];
  isPopular: boolean;
  isTrending: boolean;
  priceMin: number;
  priceMax: number;
  currency: string;
  discount?: {
    percentage: number;
    validUntil: string;
  };
  agency?: {
    id: string;
    name: string;
    logo: string;
    description: string;
    city: string;
    state: string;
  };
}

interface RecommendedActivity {
  id: string;
  title: string;
  location: string;
  duration: string;
  rating: number;
  ratingCount: number;
  image: string;
  priceLabel: string;
  price: string;
}






export default function ExperienceDetails() {
  const [activity, setActivity] = useState<Activity | null>(null);
  const [recommendedActivities, setRecommendedActivities] = useState<RecommendedActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch all activities to get an ID
        const activitiesRes = await fetch('/api/activities/all');
        const activitiesData = await activitiesRes.json();

        if (!activitiesData.error && activitiesData.length > 0) {
          // Get the first activity ID
          const activityId = activitiesData[0].id;

          // Fetch activity details
          const activityRes = await fetch(`/api/activities/${activityId}`);
          const activityData = await activityRes.json();

          if (!activityData.error) {
            setActivity(activityData);
          } else {
            setError(activityData.error);
          }

          // Set recommended activities (use the rest of the activities)
          if (activitiesData.length > 1) {
            const recommended = activitiesData.slice(1, 4).map((item: any) => ({
              id: item.id,
              title: item.name,
              location: item.location,
              duration: item.duration,
              rating: item.rating,
              ratingCount: item.reviewCount,
              image: item.coverImage,
              priceLabel: 'per person',
              price: `₹${item.priceMin}`,
            }));
            setRecommendedActivities(recommended);
          }
        } else {
          setError('No activities found in the database');
        }
      } catch (err) {
        console.error('Error fetching activity data:', err);
        setError('Failed to load activity data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">Error</h2>
          <p className="text-gray-600 mt-2">{error || 'Failed to load activity'}</p>
        </div>
      </div>
    );
  }

  // Prepare hero gallery data from database
  const heroGalleryData = {
    title: activity.name,
    location: activity.location,
    duration: activity.duration,
    category: activity.type,
    rating: activity.rating,
    reviewCount: activity.reviewCount,
    images: activity.images?.map((url, index) => ({
      url,
      alt: `${activity.name} - Image ${index + 1}`,
      caption: `${activity.name} - Image ${index + 1}`,
    })) || [],
  };

  // Prepare about data from database
  const aboutData = {
    title: 'About this experience',
    paragraphs: [
      activity.description,
    ],
  };

  // Prepare highlights data from database
  const highlightsData = {
  title: "Highlights",
  highlights: activity.highlights.map((h) => ({ title: h })),
};



  // Prepare included items data from database
  const includedData = {
    title: "What's included",
    items: activity.includes,
  };

  // Prepare recommended activities data
  const recommendedData = {
    title: 'Recommended Activities',
    items: recommendedActivities,
  };

  // Prepare booking sidebar data from database
  const originalPrice = activity.discount 
    ? Math.round(activity.priceMin * (1 + activity.discount.percentage / 100))
    : activity.priceMax;

  const bookingData = {
    price: activity.priceMin,
    originalPrice: originalPrice,
    nextDate: activity.discount?.validUntil 
      ? new Date(activity.discount.validUntil).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        })
      : 'Available Now',
    remainingSeats: activity.maxGroupSize,
    badges: [
      {
        icon: 'verified',
        label: 'Verified',
        colorClass: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 ',
      },
      {
        icon: 'bolt',
        label: 'Instant confirmation',
        colorClass: 'bg-blue-500/10 border border-blue-500/20 text-blue-600 ',
      },
    ],
    cancellationPolicy:
      'Free cancellation up to 48 hours before the start of the experience. Full refund within 5 business days.',
    // Activity data for display
    title: activity.name,
    category: activity.type,
    rating: activity.rating,
    reviewCount: activity.reviewCount,
    duration: activity.duration,
    location: activity.location,
    difficulty: activity.difficulty,
    // Activity data for cart
    activityId: activity.id,
    activitySlug: activity.slug,
    currency: activity.currency,
  };

  const handleAddToCart = () => {
    console.log('Added to cart');
    // Add your cart logic here
  };

  return (
    <>

  <main className="max-w-7xl mx-auto px-6 py-12">

  <div className="grid grid-cols-12 gap-4">

    {/* Left Column */}
    <div className="col-span-12 lg:col-span-8 flex flex-col gap-[1rem]">

      {/* Move Hero Here */}
      <HeroWithGallery {...heroGalleryData} />

      {/* <AgencySection
        agencyName={activity.agency?.name || 'Agency'}
        agencyLogo={activity.agency?.logo || '/logo.svg'}
        location={`${activity.agency?.city || 'City'}, ${activity.agency?.state || 'State'}`}
        rating={activity.rating}
        reviewCount={activity.reviewCount}
        isVerified={true}
        agencySlug={activity.agency?.id || 'agency'}
      /> */}


      <AboutSection {...aboutData} />
      <HighlightsSection {...highlightsData} />
      <IncludedSection {...includedData} />

      <div className="w-full overflow-hidden">
        <RecommendedActivities 
          items={recommendedData.items} 
          title={recommendedData.title} 
        />
      </div>

    </div>

    {/* Right Column */}
    <div className="col-span-12 lg:col-span-4">
      <div className="sticky top-20">
        <BookingSidebar 
          {...bookingData} 
          onAddToCart={handleAddToCart} 
        />
      </div>
    </div>

  </div>

  {/* Full Width Section */}
  <div className="mt-10 border-t border-gray-300 pt-10">
    <ReviewsSection reviews={[]} />
  </div>

</main>

  </>
  );

}

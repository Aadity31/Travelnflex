// types/experience.ts

export interface HeroData {
  title: string;
  location: string;
  duration: string;
  category: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  imageAlt: string;
}

export interface AboutData {
  title: string;
  paragraphs: string[];
}

export interface Highlight {
  icon: string;
  title: string;
  description: string;
}

export interface HighlightsData {
  title: string;
  highlights: Highlight[];
}

export interface IncludedData {
  title: string;
  items: string[];
}

export interface Review {
  initials: string;
  name: string;
  date: string;
  comment: string;
}

export interface RatingDistribution {
  star: number;
  percentage: number;
}

export interface ReviewsData {
  title: string;
  overallRating: number;
  totalReviews: number;
  ratingDistribution: RatingDistribution[];
  reviews: Review[];
}

export interface Activity {
  title: string;
  price: string;
  imageUrl: string;
  imageAlt: string;
}

export interface RecommendedData {
  title: string;
  activities: Activity[];
}

export interface Badge {
  icon: string;
  label: string;
  colorClass: string;
}

export interface BookingData {
  price: number;
  originalPrice: number;
  nextDate: string;
  remainingSeats: number;
  badges: Badge[];
  cancellationPolicy: string;
}

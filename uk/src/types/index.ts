export interface Destination {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  image: string;
  gallery: string[];
  highlights: string[];
  location: {
    coordinates: [number, number];
    address: string;
  };
  bestTimeToVisit: string;
  averageRating: number;
  reviewCount: number;
  activities: Activity[];
}

export interface Activity {
  id: string;
  name: string;
  slug: string;
  type: "adventure" | "spiritual" | "cultural" | "food" | "trekking";
  description: string;
  duration: string;

  createdAt: string;

  price: {
    min: number;
    max: number;
    currency: string;
  };
  difficulty: "easy" | "moderate" | "difficult";
  location: string;
  images: string[];
  reviewCount: number;
  rating: number;
  includes: string[];

  reviews?: Review[]; //  MAKE OPTIONAL
}

export interface TravelPackage {
  id: string;
  name: string;
  slug: string;
  type: "spiritual" | "adventure" | "combined" | "custom";
  duration: {
    days: number;
    nights: number;
  };
  price: {
    starting: number;
    currency: string;
  };
  destinations: string[];
  activities: string[];
  includes: string[];
  itinerary: ItineraryDay[];
  images: string[];
  rating: number;
  reviewCount: number;
}

export interface LocalGuide {
  id: string;
  name: string;
  avatar: string;
  specialities: string[];
  languages: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  price: number;
  availability: boolean;
  certifications: string[];
  description: string;
  location: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodation: string;
}

export interface SearchFilters {
  location?: string;
  activityType?: Activity["type"]; // Keep for backward compatibility
  activityTypes?: Activity["type"][]; // NEW - Multiple selection
  priceRange?: [number, number];
  duration?: string;
  difficulty?: Activity["difficulty"]; // Keep for backward compatibility
  difficulties?: Activity["difficulty"][]; // NEW - Multiple selection
  rating?: number; // Keep for backward compatibility
  ratings?: number[]; // NEW - Multiple selection
  date?: string;
  guests?: number;
}


/* ============ EXISTING TYPES (Keep these) ============ */

export type ActivityType = "adventure" | "spiritual" | "cultural" | "food" | "trekking";
export type DifficultyLevel = "easy" | "moderate" | "difficult";

export interface Activity {
  id: string;
  name: string;
  slug: string;
  type: ActivityType;
  description: string;
  shortDescription: string;
  duration: string;
  location: string;
  difficulty: DifficultyLevel;
  rating: number;
  reviewCount: number;
  maxGroupSize: number;
  images: string[];
  highlights: string[];
  includes: string[];
  isPopular: boolean;
  isTrending: boolean;
  price: {
    min: number;
    max: number;
    currency: string;
  };
  discount?: {
    percentage: number;
    validUntil: string;
  };
  createdAt: string;
  agency?: Agency;
}

export interface SearchFilters {
  location?: string;
  activityTypes?: ActivityType[];
  difficulties?: DifficultyLevel[];
  priceRange?: [number, number];
  ratings?: number[];
}

/* ============ NEW TYPES FOR BOOKING PAGE ============ */

export interface Agency {
  name: string;
  logo?: string;
  description?: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface UnifiedData {
  id: string;
  name: string;
  slug: string;
  description: string;
  location: string;
  rating: number;
  reviewCount: number;
  duration?: string;
  images: string[];
  highlights?: string[];
  includes?: string[];
  type?: ActivityType;
  difficulty?: DifficultyLevel;
  priceMin: number;
  priceMax: number;
  currency?: string;
  agency?: Agency;
  createdAt?: string;
  // Destination specific
  popularActivities?: string[];
  bestTimeToVisit?: string;
  badgeText?: string;
  badgeType?: string;
}


/* ============ BOOKING TYPES ============ */

export type PackageType = "solo" | "family" | "private" | "group";

export interface BookingState {
  packageType: PackageType;
  seats: number;
  rooms: number;
  checkIn: string;
  checkOut: string;
}

export interface PricingBreakdown {
  pricePerPerson: number;
  roomCost: number;
  subtotal: number;
  discount: number;
  total: number;
}
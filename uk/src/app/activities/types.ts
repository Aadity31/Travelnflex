export type Activity = {
  id: string;
  name: string;
  slug: string;

  type: 'adventure' | 'spiritual' | 'cultural' | 'food' | 'trekking';

  description: string;
  shortDescription?: string;

  duration: string;
  location: string;

  difficulty: 'easy' | 'moderate' | 'difficult';

  rating: number;
  reviewCount?: number;

  createdAt: string; // 👈 REQUIRED for infinite scroll cursor

  maxGroupSize?: number;

  images: string[];

  highlights?: string[];
  includes: string[];

  isPopular?: boolean;
  isTrending?: boolean;

  price: {
    min: number;
    max: number;
    currency: 'INR';
  };

  discount?: {
    percentage: number;
    validUntil: string;
  };
};

// lib/reviews.ts

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export function getAverageRating(
  reviews: Review[],
  defaultRating: number
): string {
  if (reviews.length === 0) return defaultRating.toFixed(1);
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return (sum / reviews.length).toFixed(1);
}

export function getRatingDistribution(reviews: Review[]): number[] {
  const dist = [0, 0, 0, 0, 0];
  reviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      dist[review.rating - 1]++;
    }
  });
  return dist.reverse(); // [5,4,3,2,1]
}

import pool from '@/lib/db';

type GetDestinationsInfiniteParams = {
  limit?: number;
  cursor?: string; // ISO string
};

export async function getDestinationsInfinite({
  limit = 12,
  cursor,
}: GetDestinationsInfiniteParams) {
  const { rows } = await pool.query(
    `
    SELECT
      id,
      name,
      slug,
      short_description,
      cover_image,
      location,
      average_rating,
      review_count,
      popular_activities,
      best_time_to_visit,
      starting_price,
      badge_text,
      badge_type,
      created_at
    FROM destinations
    WHERE is_active = TRUE
      AND ($1::timestamptz IS NULL OR created_at < $1)
    ORDER BY created_at DESC
    LIMIT $2
    `,
    [cursor ?? null, limit]
  );

  return rows.map(row => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    shortDescription: row.short_description,
    image: row.cover_image,
    location: row.location,
    rating: Number(row.average_rating),
    reviewCount: row.review_count,
    popularActivities: row.popular_activities ?? [],
    bestTimeToVisit: row.best_time_to_visit,
    startingPrice: row.starting_price,
    badgeText: row.badge_text,
    badgeType: row.badge_type,

    // 🔑 cursor continuity (MOST IMPORTANT)
    createdAt: row.created_at.toISOString(),
  }));
}

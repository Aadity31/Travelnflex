import pool from '@/lib/db';

export async function getFeaturedDestinations(limit = 6) {
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
      badge_type
    FROM destinations
    WHERE is_active = TRUE
    ORDER BY
      CASE badge_type
        WHEN 'popular' THEN 1
        WHEN 'trending' THEN 2
        WHEN 'new' THEN 3
        ELSE 4
      END,
      average_rating DESC
    LIMIT $1
    `,
    [limit]
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
    badgeType: row.badge_type
  }));
}

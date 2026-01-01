import pool from '@/lib/db';

export async function getFeaturedDestinations(limit = 6) {
  const { rows } = await pool.query(
    `
    SELECT
      d.id,
      d.name,
      d.slug,
      d.short_description,
      d.cover_image,
      d.location,
      d.average_rating,
      d.review_count,
      d.popular_activities,
      d.best_time_to_visit,
      d.badge_text,
      d.badge_type,

      p.price_per_person,

      disc.percentage AS discount_percentage,
      disc.valid_until AS discount_valid_until

    FROM destinations d
    JOIN destination_prices p
      ON p.destination_id = d.id
    LEFT JOIN destination_discounts disc
      ON disc.destination_id = d.id

    WHERE d.is_active = TRUE

    ORDER BY
      CASE d.badge_type
        WHEN 'popular' THEN 1
        WHEN 'trending' THEN 2
        WHEN 'new' THEN 3
        ELSE 4
      END,
      d.average_rating DESC,
      d.id DESC

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

    startingPrice: row.price_per_person,

    badgeText: row.badge_text,
    badgeType: row.badge_type,

    // 🔒 FUTURE READY (UI can ignore / comment)
    discount: row.discount_percentage
      ? {
          percentage: row.discount_percentage,
          validUntil: row.discount_valid_until,
        }
      : undefined,
  }));
}

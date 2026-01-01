import pool from '@/lib/db';

type Cursor = {
  createdAt: string;
  id: string;
};

export async function getDestinationsInfinite({
  limit = 12,
  cursor,
}: {
  limit?: number;
  cursor?: Cursor;
}) {
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
      d.created_at,

      p.price_per_person,

      disc.percentage AS discount_percentage,
      disc.valid_until AS discount_valid_until

    FROM destinations d
    JOIN destination_prices p
      ON p.destination_id = d.id
    LEFT JOIN destination_discounts disc
      ON disc.destination_id = d.id

    WHERE d.is_active = TRUE
      AND (
        $1::timestamptz IS NULL
        OR (d.created_at, d.id) < ($1, $2)
      )

    ORDER BY d.created_at DESC, d.id DESC
    LIMIT $3
    `,
    [
      cursor?.createdAt ?? null,
      cursor?.id ?? null,
      limit,
    ]
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

    startingPrice: row.price_per_person, // 🔥 FIX

    badgeText: row.badge_text,
    badgeType: row.badge_type,

    // 🔒 future-ready (UI ignore/comment safe)
    discount: row.discount_percentage
      ? {
          percentage: row.discount_percentage,
          validUntil: row.discount_valid_until,
        }
      : undefined,

    // 🔑 composite cursor
    createdAt: row.created_at.toISOString(),
  }));
}

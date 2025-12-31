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
      AND (
        $1::timestamptz IS NULL
        OR (created_at, id) < ($1, $2)
      )
    ORDER BY created_at DESC, id DESC
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
    startingPrice: row.starting_price,
    badgeText: row.badge_text,
    badgeType: row.badge_type,

    createdAt: row.created_at.toISOString(),
  }));
}

import pool from '@/lib/db';

export async function getActivitiesInfinite({
  limit = 12,
  cursor,
}: {
  limit?: number;
  cursor?: string;
}) {
  const { rows } = await pool.query(
    `
    SELECT
      a.id,
      a.name,
      a.slug,
      a.type,
      a.description,
      a.short_description,
      a.duration,
      a.location,
      a.difficulty,
      a.rating,
      a.review_count,
      a.max_group_size,
      a.cover_image,
      a.gallery_images,
      a.highlights,
      a.includes,
      a.is_popular,
      a.is_trending,
      a.created_at,

      p.price_min,
      p.price_max,
      p.currency

    FROM activities a
    JOIN activity_prices p ON p.activity_id = a.id
    WHERE a.is_active = TRUE
      AND ($1::timestamptz IS NULL OR a.created_at < $1)
    ORDER BY a.created_at DESC
    LIMIT $2
    `,
    [cursor ?? null, limit]
  );

  return rows.map(row => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    type: row.type,
    description: row.description,
    shortDescription: row.short_description,
    duration: row.duration,
    location: row.location,
    difficulty: row.difficulty,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    maxGroupSize: row.max_group_size,

    images: [row.cover_image, ...row.gallery_images],
    highlights: row.highlights,
    includes: row.includes,

    isPopular: row.is_popular,
    isTrending: row.is_trending,

    createdAt: row.created_at.toISOString(),
    // 🔥 MOST IMPORTANT

    price: {
      min: row.price_min,
      max: row.price_max,
      currency: row.currency,
    },
  }));
}

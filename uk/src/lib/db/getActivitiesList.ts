import pool from '@/lib/db';

type GetActivitiesListParams = {
  page?: number;
  limit?: number;
  type?: 'adventure' | 'spiritual' | 'cultural' | 'food' | 'trekking';
  difficulty?: 'easy' | 'moderate' | 'difficult';
  location?: string;
  minRating?: number;
};

export async function getActivitiesList({
  page = 1,
  limit = 12,
  type,
  difficulty,
  location,
  minRating,
}: GetActivitiesListParams) {
  const offset = (page - 1) * limit;

  const { rows } = await pool.query(
    `
    SELECT
      a.id,
      a.name,
      a.slug,
      a.created_at,                 -- ✅ REQUIRED (cursor + TS fix)
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

      p.price_min,
      p.price_max,
      p.currency,

      d.percentage AS discount_percentage,
      d.valid_until AS discount_valid_until

    FROM activities a
    JOIN activity_prices p ON p.activity_id = a.id
    LEFT JOIN activity_discounts d ON d.activity_id = a.id

    WHERE a.is_active = TRUE
      AND ($1::text IS NULL OR a.type = $1)
      AND ($2::text IS NULL OR a.difficulty = $2)
      AND ($3::text IS NULL OR a.location ILIKE '%' || $3 || '%')
      AND ($4::numeric IS NULL OR a.rating >= $4)

    ORDER BY a.created_at DESC
    LIMIT $5 OFFSET $6
    `,
    [
      type ?? null,
      difficulty ?? null,
      location ?? null,
      minRating ?? null,
      limit,
      offset,
    ]
  );

  return rows.map(row => ({
    id: row.id,
    name: row.name,
    slug: row.slug,

    createdAt: row.created_at,       // ✅ FIXED (red line gone)

    type: row.type,
    description: row.description,
    shortDescription: row.short_description,
    duration: row.duration,
    location: row.location,
    difficulty: row.difficulty,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    maxGroupSize: row.max_group_size,

    images: [row.cover_image, ...(row.gallery_images ?? [])],

    highlights: row.highlights ?? [],
    includes: row.includes ?? [],

    isPopular: row.is_popular,
    isTrending: row.is_trending,

    price: {
      min: row.price_min,
      max: row.price_max,
      currency: row.currency,
    },

    discount: row.discount_percentage
      ? {
          percentage: row.discount_percentage,
          validUntil: row.discount_valid_until,
        }
      : undefined,
  }));
}

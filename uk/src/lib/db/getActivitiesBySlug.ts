import pool from "@/lib/db";

export async function getActivityBySlug(slug: string) {
  const { rows } = await pool.query(
    `
    SELECT
      a.id,
      a.name,
      a.slug,
      a.created_at,
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
    WHERE a.slug = $1
      AND a.is_active = TRUE
    LIMIT 1
    `,
    [slug]
  );

  if (rows.length === 0) return null;

  const row = rows[0];

  // 🔑 SAME SHAPE AS OTHER FUNCTIONS
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,

    createdAt: row.created_at,

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
  };
}

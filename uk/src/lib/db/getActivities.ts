import pool from '@/lib/db';

export async function getActivities() {
  const { rows } = await pool.query(`
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
  `);

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
    isPopular: row.is_popular,
    isTrending: row.is_trending,

    price: {
      min: row.price_min,
      max: row.price_max,
      currency: row.currency
    },

    discount: row.discount_percentage
      ? {
          percentage: row.discount_percentage,
          validUntil: row.discount_valid_until
        }
      : undefined
  }));
}

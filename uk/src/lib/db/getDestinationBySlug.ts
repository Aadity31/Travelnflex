// lib/db/getDestinationBySlug.ts

import pool from '@/lib/db';

export async function getDestinationBySlug(slug: string) {
  const { rows } = await pool.query(
    `
    SELECT
      d.id,
      d.name,
      d.slug,
      d.description,
      d.short_description,
      d.location,
      d.average_rating,
      d.review_count,
      d.cover_image,
      d.gallery_images,
      d.highlights,
      d.popular_activities,
      d.best_time_to_visit,
      d.badge_text,
      d.badge_type,
      d.created_at,

      p.price_per_person,
      p.currency,

      disc.percentage AS discount_percentage,
      disc.valid_until AS discount_valid_until,

      ag.name AS agency_name,
      ag.logo AS agency_logo,
      ag.description AS agency_description

    FROM destinations d
    JOIN destination_prices p ON p.destination_id = d.id
    LEFT JOIN destination_discounts disc ON disc.destination_id = d.id
    LEFT JOIN agencies ag ON ag.id = d.agency_id

    WHERE d.slug = $1 AND d.is_active = TRUE
    LIMIT 1
    `,
    [slug]
  );

  if (rows.length === 0) {
    return null;
  }

  const row = rows[0];

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    shortDescription: row.short_description,
    location: row.location,
    rating: Number(row.average_rating),
    reviewCount: row.review_count,
    
    images: [row.cover_image, ...(row.gallery_images || [])],
    
    highlights: row.highlights || [],
    popularActivities: row.popular_activities || [],
    bestTimeToVisit: row.best_time_to_visit,
    
    badgeText: row.badge_text,
    badgeType: row.badge_type,
    
    priceMin: row.price_per_person,
    priceMax: row.price_per_person, // Destinations usually have single price
    currency: row.currency,
    
    discount: row.discount_percentage
      ? {
          percentage: row.discount_percentage,
          validUntil: row.discount_valid_until,
        }
      : undefined,
    
    agency: row.agency_name
      ? {
          name: row.agency_name,
          logo: row.agency_logo,
          description: row.agency_description,
        }
      : undefined,
    
    createdAt: row.created_at,
  };
}

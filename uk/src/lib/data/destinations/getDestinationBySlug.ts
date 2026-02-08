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
      d.hotel_images,
      d.hotel_image_public_ids,

      p.price_per_person,
      p.currency,
      p.solo_traveler_price,
      p.solo_traveler_includes,
      p.family_package_price,
      p.family_package_includes,
      p.join_group_price,
      p.join_group_includes,
      p.own_group_price,
      p.own_group_includes,

      disc.solo_traveler_discount,
      disc.solo_traveler_valid_until,
      disc.family_package_discount,
      disc.family_package_valid_until,
      disc.join_group_discount,
      disc.join_group_valid_until,
      disc.own_group_discount,
      disc.own_group_valid_until

    FROM destinations d
    JOIN destination_prices p ON p.destination_id = d.id
    LEFT JOIN destination_discounts disc ON disc.destination_id = d.id
    -- ✅ REMOVED: LEFT JOIN agencies

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
    hotelImages: row.hotel_images || [],
    hotelImagePublicIds: row.hotel_image_public_ids || [],
    
    highlights: row.highlights || [],
    popularActivities: row.popular_activities || [],
    bestTimeToVisit: row.best_time_to_visit,
    
    badgeText: row.badge_text,
    badgeType: row.badge_type,
    
    // Use solo_traveler_price as default price, fallback to price_per_person
    priceMin: row.solo_traveler_price || row.price_per_person,
    priceMax: row.solo_traveler_price || row.price_per_person,
    currency: row.currency,
    
    // Package-specific pricing
    soloTravelerPrice: row.solo_traveler_price || row.price_per_person,
    familyPackagePrice: row.family_package_price,
    joinGroupPrice: row.join_group_price,
    ownGroupPrice: row.own_group_price,
    
    // Package-specific includes
    soloTravelerIncludes: row.solo_traveler_includes ? row.solo_traveler_includes.split('\n').filter(Boolean) : [],
    familyPackageIncludes: row.family_package_includes ? row.family_package_includes.split('\n').filter(Boolean) : [],
    joinGroupIncludes: row.join_group_includes ? row.join_group_includes.split('\n').filter(Boolean) : [],
    ownGroupIncludes: row.own_group_includes ? row.own_group_includes.split('\n').filter(Boolean) : [],
    
    // Package-specific discounts
    discount: {
      soloTraveler: row.solo_traveler_discount
        ? { percentage: row.solo_traveler_discount, validUntil: row.solo_traveler_valid_until }
        : undefined,
      familyPackage: row.family_package_discount
        ? { percentage: row.family_package_discount, validUntil: row.family_package_valid_until }
        : undefined,
      joinGroup: row.join_group_discount
        ? { percentage: row.join_group_discount, validUntil: row.join_group_valid_until }
        : undefined,
      ownGroup: row.own_group_discount
        ? { percentage: row.own_group_discount, validUntil: row.own_group_valid_until }
        : undefined,
    },
    
    createdAt: row.created_at,
  };
}

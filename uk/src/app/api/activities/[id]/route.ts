import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
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
        p.currency,

        d.percentage AS discount_percentage,
        d.valid_until AS discount_valid_until,

        ag.uuid AS agency_uuid,
        ag.name AS agency_name,
        ag.logo_url AS agency_logo,
        ag.description AS agency_description,
        ag.city AS agency_city,
        ag.state AS agency_state

      FROM activities a
      JOIN activity_prices p ON p.activity_id = a.id
      LEFT JOIN activity_discounts d ON d.activity_id = a.id
      LEFT JOIN agencies ag ON ag.code = a.agency_code
      WHERE a.id = $1 AND a.is_active = TRUE
      LIMIT 1
      `,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Activity not found' },
        { status: 404 }
      );
    }

    const row = rows[0];

    const activity = {
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
      
      coverImage: row.cover_image,
      images: [row.cover_image, ...(row.gallery_images || [])],
      galleryImages: row.gallery_images || [],
      
      highlights: row.highlights || [],
      includes: row.includes || [],
      
      isPopular: row.is_popular,
      isTrending: row.is_trending,
      
      priceMin: row.price_min,
      priceMax: row.price_max,
      currency: row.currency,
      
      discount: row.discount_percentage
        ? {
            percentage: row.discount_percentage,
            validUntil: row.discount_valid_until,
          }
        : undefined,
      
      agency: row.agency_uuid
        ? {
            id: row.agency_uuid,
            name: row.agency_name,
            logo: row.agency_logo,
            description: row.agency_description,
            city: row.agency_city,
            state: row.agency_state,
          }
        : null,
      
      createdAt: row.created_at,
    };

    return NextResponse.json(activity);
  } catch (err) {
    console.error('API /activities/[id] error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

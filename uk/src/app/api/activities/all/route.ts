import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const { rows } = await pool.query(
      `
      SELECT
        a.id,
        a.name,
        a.slug,
        a.type,
        a.short_description,
        a.duration,
        a.location,
        a.rating,
        a.review_count,
        a.cover_image,
        a.is_popular,
        a.is_trending,

        p.price_min,
        p.price_max,
        p.currency

      FROM activities a
      JOIN activity_prices p ON p.activity_id = a.id
      WHERE a.is_active = TRUE
      ORDER BY
        a.is_trending DESC,
        a.is_popular DESC,
        a.rating DESC
      LIMIT 10
      `
    );

    const activities = rows.map(row => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      type: row.type,
      shortDescription: row.short_description,
      duration: row.duration,
      location: row.location,
      rating: Number(row.rating),
      reviewCount: row.review_count,
      coverImage: row.cover_image,
      isPopular: row.is_popular,
      isTrending: row.is_trending,
      priceMin: row.price_min,
      priceMax: row.price_max,
      currency: row.currency,
    }));

    return NextResponse.json(activities);
  } catch (err) {
    console.error('API /activities/all error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

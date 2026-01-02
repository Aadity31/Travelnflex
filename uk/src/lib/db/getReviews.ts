// lib/db/getReviews.ts

import pool from '@/lib/db';

type GetReviewsParams = {
  slug: string;
  type: 'activity' | 'destination';
  limit?: number;
};

export async function getReviews({
  slug,
  type,
  limit = 10,
}: GetReviewsParams) {
  // Determine which table to join based on type
  const tableName = type === 'activity' ? 'activities' : 'destinations';
  const foreignKey = type === 'activity' ? 'activity_id' : 'destination_id';

  const { rows } = await pool.query(
    `
    SELECT
      r.id,
      r.user_name,
      r.rating,
      r.comment,
      r.created_at

    FROM reviews r
    JOIN ${tableName} t ON r.${foreignKey} = t.id

    WHERE t.slug = $1
      AND r.is_approved = TRUE

    ORDER BY r.created_at DESC
    LIMIT $2
    `,
    [slug, limit]
  );

  return rows.map(row => ({
    id: row.id,
    userName: row.user_name,
    rating: Number(row.rating),
    comment: row.comment,
    date: row.created_at.toISOString(),
  }));
}

// app/api/login/login-google/route.ts

import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// PostgreSQL connection (local now, AWS later – same code)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      id: google_user_id,
      email,
      email_verified,
      name,
      given_name,
      family_name,
      picture,
      locale,
    } = body;

    // basic validation
    if (!google_user_id || !email) {
      return NextResponse.json(
        { success: false, message: 'Invalid Google payload' },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      const query = `
        INSERT INTO users (
          id,
          google_user_id,
          email,
          email_verified,
          full_name,
          given_name,
          family_name,
          avatar,
          locale,
          provider,
          created_at
        )
        VALUES (
          gen_random_uuid(),
          $1, $2, $3, $4, $5, $6, $7, $8,
          'google',
          NOW()
        )
        ON CONFLICT (email)
        DO UPDATE SET
          google_user_id = EXCLUDED.google_user_id,
          email_verified = EXCLUDED.email_verified,
          full_name = EXCLUDED.full_name,
          given_name = EXCLUDED.given_name,
          family_name = EXCLUDED.family_name,
          avatar = EXCLUDED.avatar,
          locale = EXCLUDED.locale,
          updated_at = NOW()
        RETURNING
          id,
          email,
          full_name,
          given_name,
          family_name,
          avatar,
          locale,
          provider;
      `;

      const values = [
        google_user_id,
        email,
        email_verified ?? true,
        name ?? null,
        given_name ?? null,
        family_name ?? null,
        picture ?? null,
        locale ?? 'en',
      ];

      const { rows } = await client.query(query, values);

      return NextResponse.json(
        {
          success: true,
          user: rows[0],
        },
        { status: 200 }
      );
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Google login API error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

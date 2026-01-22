import { NextResponse } from "next/server";
import pool from "@/lib/db";          // your db file
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // your auth config

export async function GET() {
  try {
    // 1. Get logged-in user
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id; // UUID

    // 2. Fetch notifications
    const { rows } = await pool.query(
      `
      SELECT id, type, title, message, data, is_read, created_at
      FROM notifications
      WHERE user_id = $1
      ORDER BY is_read ASC, created_at DESC
      LIMIT 20
      `,
      [userId]
    );

    // 3. Return
    return NextResponse.json(rows);

  } catch (err) {
    console.error("Notifications API error:", err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

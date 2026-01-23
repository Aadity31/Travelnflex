import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    console.log("SESSION:", session); // debug

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    /* ---------------------------
       Get User ID
    ---------------------------- */
    const userRes = await pool.query(
      `
      SELECT id
      FROM users
      WHERE email = $1
      LIMIT 1
      `,
      [session.user.email]
    );

    const user = userRes.rows[0];

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    /* ---------------------------
       Get Notifications
    ---------------------------- */
    const notifRes = await pool.query(
      `
      SELECT
        id,
        title,
        message,
        type,
        is_read,
        created_at,
        link
      FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 20
      `,
      [user.id]
    );

    return NextResponse.json(notifRes.rows);

  } catch (err) {
    console.error("Notifications API error:", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

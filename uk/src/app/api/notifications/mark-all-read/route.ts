import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";

export async function POST() {
  try {
    /* -----------------------------
       Auth Check
    ------------------------------ */
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    /* -----------------------------
       Get User
    ------------------------------ */
    const userRes = await pool.query(
      `
      SELECT id
      FROM users
      WHERE email = $1
      LIMIT 1
      `,
      [session.user.email]
    );

    if (userRes.rowCount === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userId = userRes.rows[0].id;

    /* -----------------------------
       Update All Unread
    ------------------------------ */
    await pool.query(
      `
      UPDATE notifications
      SET is_read = true
      WHERE user_id = $1
        AND is_read = false
      `,
      [userId]
    );

    /* -----------------------------
       Success
    ------------------------------ */
    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Mark all read failed:", err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

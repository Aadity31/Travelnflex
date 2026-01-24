import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
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
       Parse Body
    ------------------------------ */
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing notification id" },
        { status: 400 }
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
       Update (Owner Only)
    ------------------------------ */
    const updRes = await pool.query(
      `
      UPDATE notifications
      SET is_read = true
      WHERE id = $1
        AND user_id = $2
      `,
      [id, userId]
    );

    if (updRes.rowCount === 0) {
      return NextResponse.json(
        { error: "Not found or not allowed" },
        { status: 404 }
      );
    }

    /* -----------------------------
       Success
    ------------------------------ */
    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("Mark read failed:", err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

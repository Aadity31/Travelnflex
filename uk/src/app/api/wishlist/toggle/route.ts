export const runtime = "nodejs";

import db from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

/* ---------------- USER RESOLVE ---------------- */

async function resolveUserIdFromToken(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token || !token.email) return null;

  const result = await db.query(
    `SELECT id
     FROM users
     WHERE email = $1
     LIMIT 1`,
    [String(token.email).toLowerCase()]
  );

  return result.rows[0]?.id || null;
}

/* ---------------- TOGGLE HANDLER ---------------- */

export async function POST(req: NextRequest) {
  const client = await db.connect();

  try {
    const userId = await resolveUserIdFromToken(req);

    if (!userId) {
      client.release();
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { itemId } = await req.json();

    if (!itemId || typeof itemId !== "string") {
      client.release();
      return Response.json(
        { error: "itemId is required" },
        { status: 400 }
      );
    }

    /* 🔒 TRANSACTION START */
    await client.query("BEGIN");

    // Lock any existing row for this user+item
    const check = await client.query(
      `
      SELECT id
      FROM wishlist
      WHERE user_id = $1 AND item_id = $2
      FOR UPDATE
      `,
      [userId, itemId]
    );

    let liked: boolean;

    if (check.rowCount && check.rowCount > 0) {
      // Exists → delete
      await client.query(
        `DELETE FROM wishlist
         WHERE user_id = $1 AND item_id = $2`,
        [userId, itemId]
      );
      liked = false;
    } else {
      // Not exists → insert
      await client.query(
        `INSERT INTO wishlist (user_id, item_id)
         VALUES ($1, $2)`,
        [userId, itemId]
      );
      liked = true;
    }

    await client.query("COMMIT");
    client.release();

    return Response.json({ liked });
  } catch (err) {
    try {
      await client.query("ROLLBACK");
    } catch {}

    client.release();
    console.error("Wishlist toggle error:", err);

    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

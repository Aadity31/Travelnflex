export const runtime = "nodejs";

import db from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

async function resolveUserIdFromToken(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token || !token.email) {
    return null;
  }

  const result = await db.query(
    `SELECT id
     FROM users
     WHERE email = $1
     LIMIT 1`,
    [String(token.email).toLowerCase()]
  );

  return result.rows[0]?.id || null;
}

export async function POST(req: NextRequest) {
  try {
    const userId = await resolveUserIdFromToken(req);

    if (!userId) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { itemId } = await req.json();

    if (!itemId || typeof itemId !== "string") {
      return Response.json(
        { error: "itemId is required" },
        { status: 400 }
      );
    }

    const check = await db.query(
      `SELECT 1
       FROM wishlist
       WHERE user_id = $1 AND item_id = $2
       LIMIT 1`,
      [userId, itemId]
    );

    if (check.rowCount && check.rowCount > 0) {
      await db.query(
        `DELETE FROM wishlist
         WHERE user_id = $1 AND item_id = $2`,
        [userId, itemId]
      );

      return Response.json({ liked: false });
    }

    await db.query(
      `INSERT INTO wishlist (user_id, item_id)
       VALUES ($1, $2)`,
      [userId, itemId]
    );

    return Response.json({ liked: true });
  } catch (err) {
    console.error("Wishlist toggle error:", err);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

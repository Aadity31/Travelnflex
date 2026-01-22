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

export async function GET(req: NextRequest) {
  try {
    const userId = await resolveUserIdFromToken(req);

    if (!userId) {
      return Response.json({ liked: false });
    }

    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get("itemId");

    if (!itemId) {
      return Response.json({ liked: false });
    }

    const result = await db.query(
      `SELECT 1
       FROM wishlist
       WHERE user_id = $1 AND item_id = $2
       LIMIT 1`,
      [userId, itemId]
    );

    return Response.json({
      liked: result.rowCount !== null && result.rowCount > 0,
    });
  } catch (err) {
    console.error("Wishlist status error:", err);
    return Response.json(
      { liked: false },
      { status: 500 }
    );
  }
}

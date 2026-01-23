export const runtime = "nodejs";

import db from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

async function resolveUserId(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token?.email) return null;

  const result = await db.query(
    `SELECT id FROM users WHERE email = $1 LIMIT 1`,
    [String(token.email).toLowerCase()]
  );

  return result.rows[0]?.id ?? null;
}

export async function GET(req: NextRequest) {
  try {
    const userId = await resolveUserId(req);

    const { searchParams } = new URL(req.url);
    const raw = searchParams.get("items");

    if (!raw) return Response.json({});

    const items = Array.from(
      new Set(
        raw
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean)
      )
    ).slice(0, 100);

    const result: Record<string, boolean> = {};
    items.forEach((id) => (result[id] = false));

    // Guest user → all false
    if (!userId) return Response.json(result);

    const rows = await db.query(
      `SELECT item_id
       FROM wishlist
       WHERE user_id = $1
       AND item_id = ANY($2::text[])`,
      [userId, items]
    );

    for (const row of rows.rows) {
      result[row.item_id] = true;
    }

    return Response.json(result);
  } catch (err) {
    console.error("Wishlist bulk error:", err);
    return Response.json({}, { status: 500 });
  }
}

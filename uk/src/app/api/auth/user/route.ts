import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import pool from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.email) {
      const userRes = await pool.query(
        `
        SELECT 
          u.id,
          u.name,
          u.email,
          u.image,
          u.created_at,
          p.phone,
          p.traveller_type,
          p.passport_number
        FROM users u
        LEFT JOIN profiles p ON u.id = p.user_id
        WHERE u.email = $1
        `,
        [session.user.email]
      );

      if (userRes.rowCount === 0) {
        return NextResponse.json({ user: null }, { status: 404 });
      }

      const user = userRes.rows[0];

      return NextResponse.json({
        user: {
          ...user,
          joinedDate: new Date(user.created_at).toISOString(),
        },
      });
    }

    const token = (await cookies()).get("manual-auth-token")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const payload = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET!
    ) as { userId: string };

    const userRes = await pool.query(
      `
      SELECT 
        u.id,
        u.name,
        u.email,
        u.image,
        u.created_at,
        p.phone,
        p.traveller_type,
        p.passport_number
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id = $1
      `,
      [payload.userId]
    );

    if (userRes.rowCount === 0) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    const user = userRes.rows[0];

    return NextResponse.json({
      user: {
        ...user,
        joinedDate: new Date(user.created_at).toISOString(),
      },
    });
  } catch (err) {
    console.error("AUTH USER API ERROR:", err);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}

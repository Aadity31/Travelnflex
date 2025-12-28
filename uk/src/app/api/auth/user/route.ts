import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import pool from "@/lib/db";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface JWT {
    userId?: string;
  }
}

export async function GET() {
  // 1️⃣ Try NextAuth session (Google)
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    const userRes = await pool.query(
      `SELECT 
        u.id, u.name, u.email, u.image, u.created_at,
        p.phone, p.location, p.bio
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id = $1`,
      [session.user.id]
    );

    if (userRes.rows.length === 0) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        ...userRes.rows[0],
        joinedDate: userRes.rows[0].created_at,
      },
    });
  }

  // 2️⃣ Try manual JWT cookie
  const token = (await cookies()).get("manual-auth-token")?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const payload = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as {
      userId: string;
    };

    const userRes = await pool.query(
      `SELECT 
        u.id, u.name, u.email, u.image, u.created_at,
        p.phone, p.location, p.bio
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id = $1`,
      [payload.userId]
    );

    if (userRes.rows.length === 0) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        ...userRes.rows[0],
        joinedDate: userRes.rows[0].created_at,
      },
    });
  } catch (error) {
    console.error("JWT verification failed:", error);
    return NextResponse.json({ user: null }, { status: 401 });
  }
}

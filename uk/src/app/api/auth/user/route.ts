import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import pool from "@/lib/db";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;            // ✅ ADD THIS
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
      "SELECT id, name, email, image FROM users WHERE id = $1",
      [session.user.id]
    );

    return NextResponse.json({ user: userRes.rows[0] });
  }

  // 2️⃣ Try manual JWT cookie
  const token = (await cookies()).get("manual-auth-token")?.value;

  if (!token) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET!
    ) as { userId: string };

    const userRes = await pool.query(
      "SELECT id, name, email, image FROM users WHERE id = $1",
      [payload.userId]
    );

    return NextResponse.json({ user: userRes.rows[0] });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}

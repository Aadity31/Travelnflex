import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password, rememberMe } = await req.json();

    // 1️⃣ Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      );
    }

    // 2️⃣ Fetch user
    const result = await pool.query(
      `
      SELECT id, name, email, image, password_hash
      FROM users
      WHERE email = $1
      `,
      [email]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    if (!user.password_hash) {
      return NextResponse.json(
        { error: "Account uses Google login" },
        { status: 401 }
      );
    }

    // 3️⃣ Compare password (NO HASHING HERE)
    const isValid = await bcrypt.compare(password, user.password_hash);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 4️⃣ Create JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.NEXTAUTH_SECRET!,
      {
        expiresIn: rememberMe ? "30d" : "1d",
      }
    );

    // 5️⃣ Set HttpOnly cookie
    (await
      // 5️⃣ Set HttpOnly cookie
      cookies()).set({
      name: "manual-auth-token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: rememberMe
        ? 60 * 60 * 24 * 30
        : 60 * 60 * 24,
    });

    // 6️⃣ Success
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    });
  } catch (err) {
    console.error("Manual login error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

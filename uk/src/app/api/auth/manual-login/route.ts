import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, rememberMe } = body;

    // 1️⃣ Basic validation
    if (!email || !password) {
      console.error("❌ Missing email or password");
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      );
    }

    // 2️⃣ Fetch user from DB
    const result = await pool.query(
      `
      SELECT id, name, email, image, password_hash
      FROM users
      WHERE email = $1
      `,
      [email]
    );

    if (result.rowCount === 0) {
      console.error("❌ User not found:", email);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // 3️⃣ Check password hash exists
    if (!user.password_hash) {
      console.error("❌ No password hash for user:", email);
      return NextResponse.json(
        { error: "Account not configured for manual login" },
        { status: 401 }
      );
    }

    // 🔍 DEBUG (REMOVE IN PRODUCTION)
    console.log("🧪 DB HASH:", user.password_hash);

    // 4️⃣ Compare password
    const isValid = await bcrypt.compare(password, user.password_hash);
    console.log("🧪 Password match:", isValid);

    if (!isValid) {
      console.error("❌ Password mismatch:", email);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 5️⃣ Create JWT (APP JWT, NOT GOOGLE)
    const token = jwt.sign(
      { userId: user.id },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: rememberMe ? "30d" : "1d" }
    );

    // 6️⃣ Set HttpOnly cookie (NO await here)
    (await
      // 6️⃣ Set HttpOnly cookie (NO await here)
      cookies()).set({
      name: "manual-auth-token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: rememberMe
        ? 60 * 60 * 24 * 30 // 30 days
        : 60 * 60 * 24,     // 1 day
    });

    console.log("✅ Manual login success:", email);

    // 7️⃣ Response
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("🔥 Manual login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

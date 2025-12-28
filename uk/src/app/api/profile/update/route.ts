import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import pool from "@/lib/db";

async function getUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    return session.user.id;
  }

  const token = (await cookies()).get("manual-auth-token")?.value;
  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as {
      userId: string;
    };
    return payload.userId;
  } catch {
    return null;
  }
}

export async function PUT(request: NextRequest) {
  const client = await pool.connect();

  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, traveller_type, passport_number } = body;

    // Validation
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, email and phone are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Phone validation
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 }
      );
    }

    // Passport validation for foreign travellers
    if (traveller_type === "foreign" && !passport_number) {
      return NextResponse.json(
        { error: "Passport number is required for foreign travellers" },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    // Get current user
    const currentUser = await client.query(
      "SELECT email FROM users WHERE id = $1",
      [userId]
    );

    if (currentUser.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check email uniqueness
    if (email !== currentUser.rows[0].email) {
      const emailCheck = await client.query(
        "SELECT id FROM users WHERE email = $1 AND id != $2",
        [email, userId]
      );

      if (emailCheck.rows.length > 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 400 }
        );
      }
    }

    // Update users table
    const userQuery = `
      UPDATE users 
      SET name = $1, email = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING id, name, email, image, created_at
    `;
    const userResult = await client.query(userQuery, [name, email, userId]);

    // Update profiles table (only active fields)
    const profileQuery = `
      INSERT INTO profiles (
        user_id, 
        phone, 
        traveller_type, 
        passport_number
      )
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id) 
      DO UPDATE SET
        phone = EXCLUDED.phone,
        traveller_type = EXCLUDED.traveller_type,
        passport_number = EXCLUDED.passport_number,
        updated_at = NOW()
      RETURNING 
        phone, 
        traveller_type, 
        passport_number
    `;

    const profileResult = await client.query(profileQuery, [
      userId,
      phone,
      traveller_type || "indian",
      traveller_type === "foreign" ? passport_number : null,
    ]);

    await client.query("COMMIT");

    const updatedUser = userResult.rows[0];
    const updatedProfile = profileResult.rows[0];

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
        phone: updatedProfile.phone,
        traveller_type: updatedProfile.traveller_type,
        passport_number: updatedProfile.passport_number,
        joinedDate: updatedUser.created_at,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Profile update error:", error);

    if (error instanceof Error && "code" in error && error.code === "23505") {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

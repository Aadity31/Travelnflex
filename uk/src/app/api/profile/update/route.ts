import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import pool from "@/lib/db";

async function getUserId(): Promise<string | null> {
  // 1️⃣ Try NextAuth session (Google)
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    return session.user.id;
  }

  // 2️⃣ Try manual JWT cookie
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
    const { name, email, phone, location, bio, image } = body;

    // Validation
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
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

    // Phone validation (optional)
    if (phone && phone.length > 0) {
      const phoneRegex = /^[\d\s\+\-\(\)]+$/;
      if (!phoneRegex.test(phone)) {
        return NextResponse.json(
          { error: "Invalid phone number" },
          { status: 400 }
        );
      }
    }

    // Bio length validation
    if (bio && bio.length > 500) {
      return NextResponse.json(
        { error: "Bio must be less than 500 characters" },
        { status: 400 }
      );
    }

    // Start transaction
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

    // Check if email already exists for another user
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

    // Update users table (name, email, image)
    const userUpdateFields = [];
    const userValues = [];
    let userParamCount = 1;

    userUpdateFields.push(`name = $${userParamCount++}`);
    userValues.push(name);

    userUpdateFields.push(`email = $${userParamCount++}`);
    userValues.push(email);

    if (image) {
      userUpdateFields.push(`image = $${userParamCount++}`);
      userValues.push(image);
    }

    userUpdateFields.push(`updated_at = NOW()`);
    userValues.push(userId);

    const userQuery = `
      UPDATE users 
      SET ${userUpdateFields.join(", ")}
      WHERE id = $${userParamCount}
      RETURNING id, name, email, image, created_at
    `;

    const userResult = await client.query(userQuery, userValues);

    // Update or insert profile table (phone, location, bio)
    const profileQuery = `
      INSERT INTO profiles (user_id, phone, location, bio)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id) 
      DO UPDATE SET
        phone = EXCLUDED.phone,
        location = EXCLUDED.location,
        bio = EXCLUDED.bio,
        updated_at = NOW()
      RETURNING phone, location, bio
    `;

    const profileResult = await client.query(profileQuery, [
      userId,
      phone || null,
      location || null,
      bio || null,
    ]);

    // Commit transaction
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
        location: updatedProfile.location,
        bio: updatedProfile.bio,
        joinedDate: updatedUser.created_at,
      },
    });
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Profile update error:", error);

    // Handle unique constraint violation
    if (error.code === "23505") {
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

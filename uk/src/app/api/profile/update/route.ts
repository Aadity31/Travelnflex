import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import pool from "@/lib/db";

async function getUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    console.log("🔍 Google User ID:", session.user.id);
    return session.user.id;
  }

  const token = (await cookies()).get("manual-auth-token")?.value;
  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as {
      userId: string;
    };
    console.log("🔍 Manual User ID:", payload.userId);
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
    console.log("🔍 Request Body:", body); // ⭐ Log request body

    const { name, email, phone, traveller_type, passport_number, image } = body;

    console.log("🔍 Extracted values:", { name, email, phone, image }); // ⭐ Log extracted values

    // Validation
    if (!name || !email || !phone) {
      console.log("❌ Validation Failed - Missing required fields:", {
        hasName: !!name,
        hasEmail: !!email,
        hasPhone: !!phone,
      });
      return NextResponse.json(
        { error: "Name, email and phone are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("❌ Invalid email format:", email);
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Phone validation
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    if (!phoneRegex.test(phone)) {
      console.log("❌ Invalid phone format:", phone);
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 }
      );
    }

    // Passport validation for foreign travellers
    if (traveller_type === "foreign" && !passport_number) {
      console.log("❌ Passport required for foreign traveller");
      return NextResponse.json(
        { error: "Passport number is required for foreign travellers" },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    console.log("🔍 Searching for userId:", userId);

    // Get current user
    const currentUser = await client.query(
      "SELECT email FROM users WHERE id::text = $1",
      [userId]
    );

    console.log("🔍 Query result:", currentUser.rows);

    if (currentUser.rows.length === 0) {
      await client.query("ROLLBACK");
      console.log("❌ User not found in database");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check email uniqueness
    if (email !== currentUser.rows[0].email) {
      const emailCheck = await client.query(
        "SELECT id FROM users WHERE email = $1 AND id::text != $2",
        [email, userId]
      );

      if (emailCheck.rows.length > 0) {
        await client.query("ROLLBACK");
        console.log("❌ Email already exists:", email);
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 400 }
        );
      }
    }

    // Update users table - with image support
    const userQuery = `
      UPDATE users 
      SET name = $1, email = $2, image = COALESCE($3, image), updated_at = NOW()
      WHERE id::text = $4
      RETURNING id, name, email, image, created_at
    `;
    const userResult = await client.query(userQuery, [
      name,
      email,
      image,
      userId,
    ]);

    console.log("✅ User table updated");

    // Update profiles table
    const profileQuery = `
      INSERT INTO profiles (
        user_id, 
        phone, 
        traveller_type, 
        passport_number
      )
      VALUES (
        (SELECT id FROM users WHERE id::text = $1),
        $2, $3, $4
      )
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

    console.log("✅ Profile table updated");

    await client.query("COMMIT");

    const updatedUser = userResult.rows[0];
    const updatedProfile = profileResult.rows[0];

    console.log("✅ Profile update successful");

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
    console.error("❌ Profile update error:", error);

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

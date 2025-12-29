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
    const { name, phone, traveller_type, passport_number, image } = body;

    // 🔹 Detect image-only update
    const isImageOnlyUpdate =
      "image" in body &&
      !("name" in body) &&
      !("phone" in body) &&
      !("traveller_type" in body) &&
      !("passport_number" in body);

    // 🔹 Validate ONLY for details update
    if (!isImageOnlyUpdate) {
      if (!name || !phone) {
        return NextResponse.json(
          { error: "Name and phone are required" },
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

      // Passport validation
      if (traveller_type === "foreign" && !passport_number) {
        return NextResponse.json(
          { error: "Passport number is required for foreign travellers" },
          { status: 400 }
        );
      }
    }

    await client.query("BEGIN");

    // 🔹 Update users table (email NEVER touched)
    const userQuery = `
      UPDATE users
      SET
        name = COALESCE($1, name),
        image = COALESCE($2, image),
        updated_at = NOW()
      WHERE id::text = $3
      RETURNING id, name, email, image, created_at
    `;
    const userResult = await client.query(userQuery, [
      name ?? null,
      image ?? null,
      userId,
    ]);

    if (userResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 🔹 Update profiles table (only if NOT image-only)
    let profileResult = null;

    if (!isImageOnlyUpdate) {
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
        RETURNING phone, traveller_type, passport_number
      `;

      profileResult = await client.query(profileQuery, [
        userId,
        phone,
        traveller_type || "indian",
        traveller_type === "foreign" ? passport_number : null,
      ]);
    }

    await client.query("COMMIT");

    const updatedUser = userResult.rows[0];
    const updatedProfile = profileResult?.rows[0];

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email, // 🔒 read-only
        image: updatedUser.image,
        phone: updatedProfile?.phone,
        traveller_type: updatedProfile?.traveller_type,
        passport_number: updatedProfile?.passport_number,
        joinedDate: updatedUser.created_at,
      },
    });
  } catch {
    await client.query("ROLLBACK");
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { deleteCloudinaryImage, getPublicIdFromUrl } from "@/lib/cloudinary";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

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

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserId();
    console.log("Delete image - UserId:", userId);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL required" },
        { status: 400 }
      );
    }

    // Extract public_id from URL
    console.log("Delete image - Image URL:", imageUrl);

    // Check if it's a Cloudinary image or external (Google, etc.)
    const isCloudinaryImage = imageUrl.includes("cloudinary.com");

    if (isCloudinaryImage) {
      const publicId = getPublicIdFromUrl(imageUrl);
      console.log("Delete image - Extracted publicId:", publicId);

      if (publicId) {
        // Delete from Cloudinary
        const deleted = await deleteCloudinaryImage(publicId);
        console.log("Delete image - Cloudinary delete result:", deleted);

        if (!deleted) {
          console.warn("Failed to delete from Cloudinary, but continuing to remove from database");
        }
      }
    } else {
      console.log("Delete image - External image (Google, etc.), skipping Cloudinary deletion");
    }

    // Remove from database (works for both Cloudinary and external images)
    await pool.query("UPDATE users SET image = NULL WHERE id::text = $1", [
      userId,
    ]);

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Delete image error:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}

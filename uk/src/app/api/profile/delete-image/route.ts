import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { deleteCloudinaryImage, getPublicIdFromUrl } from "@/lib/cloudinary";
import pool from "@/lib/db";

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
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
    const publicId = getPublicIdFromUrl(imageUrl);

    if (!publicId) {
      return NextResponse.json({ error: "Invalid image URL" }, { status: 400 });
    }

    // Delete from Cloudinary
    const deleted = await deleteCloudinaryImage(publicId);

    if (!deleted) {
      return NextResponse.json(
        { error: "Failed to delete from Cloudinary" },
        { status: 500 }
      );
    }

    // Remove from database
    await pool.query("UPDATE users SET image = NULL WHERE id::text = $1", [
      session.user.id,
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

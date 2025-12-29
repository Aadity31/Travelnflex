import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Extract public_id from Cloudinary URL
export function getPublicIdFromUrl(url: string): string | null {
  if (!url || !url.includes("cloudinary.com")) return null;

  try {
    // URL format: https://res.cloudinary.com/cloud_name/image/upload/v123456/public_id.jpg
    const parts = url.split("/");
    const filename = parts[parts.length - 1]; // file.jpg
    const publicId = filename.split(".")[0]; // file
    return publicId;
  } catch {
    return null;
  }
}

// Delete image from Cloudinary
export async function deleteCloudinaryImage(
  publicId: string
): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("🗑️ Cloudinary delete result:", result);
    return result.result === "ok";
  } catch (error) {
    console.error("❌ Error deleting from Cloudinary:", error);
    return false;
  }
}

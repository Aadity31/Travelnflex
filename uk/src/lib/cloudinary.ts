import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;


cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

// Extract public_id from Cloudinary URL
export function getPublicIdFromUrl(url: string): string | null {
  if (!url || !url.includes("cloudinary.com")) return null;

  try {
    // URL format: https://res.cloudinary.com/cloud_name/image/upload/v123456/folder/public_id.jpg
    // Or with transformations: https://res.cloudinary.com/cloud_name/image/upload/w_400,h_400/folder/public_id.jpg
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");

    // Find the index after 'upload' in the path
    const uploadIndex = pathParts.indexOf("upload");
    if (uploadIndex === -1) return null;

    // Get everything after 'upload'
    let publicIdParts = pathParts.slice(uploadIndex + 1);

    // Remove transformation parameters (they contain commas like w_400,h_400)
    publicIdParts = publicIdParts.filter(part => !part.includes(","));

    // Remove version number if it starts with 'v' followed by digits (e.g., v1769974489)
    // Version is typically the first part after upload and transformations
    publicIdParts = publicIdParts.filter(part => !/^v\d+$/.test(part));

    // Join remaining parts and remove file extension
    const publicIdWithExt = publicIdParts.join("/");
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, "");

    console.log("🔍 Extracted public_id:", publicId);
    return publicId;
  } catch (error) {
    console.error("❌ Error extracting public_id:", error);
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

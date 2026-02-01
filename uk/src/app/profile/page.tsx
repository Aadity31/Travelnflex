"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import UserAvatar from "@/components/UserAvatar";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Camera,
  Heart,
  BookMarked,
  Clock,
  Award,
  Settings,
  Sparkles,
  Star,
  TrendingUp,
  LucideIcon,
  X,
  Trash2,
  Upload,
} from "lucide-react";

type UserType = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  phone?: string;
  location?: string;
  joinedDate?: string;
  bio?: string;
};

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasFetched = useRef(false);

  /* ---------- AUTH CHECK ---------- */
  useEffect(() => {
    if (session === null) {
      router.push("/login");
    }
  }, [session, router]);

  /* ---------- FETCH USER ---------- */
  useEffect(() => {
    if (session === undefined || hasFetched.current) return;
    if (session === null) {
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/auth/user");
        const data = await res.json();
        if (data?.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
        hasFetched.current = true;
      }
    };

    fetchUser();
  }, [session, router]);

  /* ---------- IMAGE HANDLERS ---------- */
  const handleCameraClick = () => {
    if (user?.image) {
      setShowPhotoModal(true);
    } else {
      fileInputRef.current?.click();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPG, PNG, or WebP)");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const dataURLtoBlob = (dataURL: string): Blob => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }

    setIsUploading(true);

    try {
      // Convert data URL to blob for upload
      const blob = dataURLtoBlob(selectedImage);
      const file = new File([blob], "profile.jpg", { type: "image/jpeg" });

      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || ""
      );
      formData.append("folder", "users/profile_pictures");

      // Upload to Cloudinary
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      // Apply face-centered crop transformation to the URL
      const transformedUrl = data.secure_url.replace(
        "/upload/",
        "/upload/w_400,h_400,c_fill,g_face/"
      );

      // Delete old image if exists
      if (user?.image) {
        await fetch("/api/profile/delete-image", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: user.image }),
        });
      }

      // Update profile with new image
      const updateRes = await fetch("/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: transformedUrl }),
      });

      if (updateRes.ok) {
        setUser((prev) =>
          prev ? { ...prev, image: transformedUrl } : null
        );
        await update({ user: { image: transformedUrl } });
        router.refresh();

        // Reset states
        setSelectedImage(null);
        setShowPhotoModal(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        toast.success("Profile picture updated successfully! 🎉", {
          duration: 3000,
          icon: "✨",
        });
      } else {
        const errorData = await updateRes.json();
        toast.error(`Failed: ${errorData.error}`);
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Error uploading image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (!user?.image) return;
    setShowPhotoModal(false);

    try {
      const res = await fetch("/api/profile/delete-image", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: user.image }),
      });

      if (res.ok) {
        setUser((prev) => (prev ? { ...prev, image: null } : null));
        await update();
        toast.success("Picture deleted! 🗑️");
      }
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  // ✅ Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="min-h-screen bg-gray-50 pt-14 sm:pt-16 lg:pt-18 pb-4 sm:pb-6 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* LEFT SIDEBAR Skeleton */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6">
            {/* Profile Card Skeleton */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-16 sm:h-20 lg:h-24 bg-gray-200 animate-pulse" />
              <div className="px-4 sm:px-6 pb-4 sm:pb-6 -mt-8 sm:-mt-10 lg:-mt-12 text-center">
                <div className="relative inline-block group mb-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto bg-gray-200 rounded-full animate-pulse ring-4 ring-white" />
                  <div className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 bg-gray-300 rounded-full animate-pulse" />
                </div>
                <div className="h-6 bg-gray-200 rounded animate-pulse mx-8 mb-2" />
                <div className="h-4 bg-gray-200 rounded animate-pulse mx-8 mb-4 w-3/4" />
                <div className="h-10 bg-gray-200 rounded-lg animate-pulse mx-4" />
                <div className="h-px bg-gray-200 my-4 animate-pulse" />
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-4 h-5 bg-gray-200 rounded animate-pulse" />
                  <div className="flex items-center gap-3 px-4 h-5 bg-gray-200 rounded animate-pulse" />
                  <div className="flex items-center gap-3 px-4 h-5 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>

            {/* Stats Card Skeleton */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-gray-200 rounded-lg animate-pulse h-20" />
                <div className="text-center p-3 bg-gray-200 rounded-lg animate-pulse h-20" />
                <div className="text-center p-3 bg-gray-200 rounded-lg animate-pulse h-20" />
                <div className="text-center p-3 bg-gray-200 rounded-lg animate-pulse h-20" />
              </div>
            </div>

            {/* Achievement Badge Skeleton */}
            <div className="hidden sm:block bg-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-pulse h-24" />
          </div>

          {/* MAIN CONTENT Skeleton */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            {/* Welcome Banner Skeleton */}
            <div className="bg-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 h-24 animate-pulse" />

            {/* Quick Links Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-white p-4 rounded-xl animate-pulse h-24 shadow-sm" />
              <div className="bg-white p-4 rounded-xl animate-pulse h-24 shadow-sm" />
              <div className="bg-white p-4 rounded-xl animate-pulse h-24 shadow-sm" />
              <div className="bg-white p-4 rounded-xl animate-pulse h-24 shadow-sm" />
            </div>

            {/* Recent Activity Skeleton */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="space-y-3">
                <div className="flex items-start gap-3 h-16 bg-gray-200 rounded-lg animate-pulse p-3" />
                <div className="flex items-start gap-3 h-16 bg-gray-200 rounded-lg animate-pulse p-3" />
                <div className="flex items-start gap-3 h-16 bg-gray-200 rounded-lg animate-pulse p-3" />
                <div className="flex items-start gap-3 h-16 bg-gray-200 rounded-lg animate-pulse p-3" />
              </div>
            </div>

            {/* Recommendations Skeleton */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="h-36 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-36 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ✅ Show skeleton while loading
  if (isLoading) {
    return <SkeletonLoader />;
  }

  // ✅ Show nothing if no user (after loading)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-14 sm:pt-16 lg:pt-18 pb-4 sm:pb-6 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* LEFT SIDEBAR - Profile Info */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-16 sm:h-20 lg:h-24 bg-gradient-to-r from-orange-500 to-red-500 relative" />

              <div className="px-4 sm:px-6 pb-4 sm:pb-6 -mt-8 sm:-mt-10 lg:-mt-12 text-center">
                <div className="relative inline-block group mb-3 sm:mb-4">
                  <UserAvatar
                    name={user?.name ?? ""}
                    image={user?.image ?? null}
                    size={64}
                    textSize="text-base sm:text-lg lg:text-xl"
                    className="sm:w-20 sm:h-20 lg:w-24 lg:h-24 ring-3 sm:ring-4 ring-white bg-white shadow-lg"
                  />

                  <button
                    onClick={handleCameraClick}
                    className="absolute bottom-0 right-0 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center shadow-md transition"
                    title={
                      user.image ? "Change or remove photo" : "Upload photo"
                    }
                  >
                    <Camera size={12} className="sm:w-3.5 sm:h-3.5" />
                  </button>
                </div>

                <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-0.5 sm:mb-1">
                  {user.name}
                </h1>
                <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4 truncate px-2">
                  {user.email}
                </p>

                <button
                  onClick={() => {
                    router.push("/profile/edit");
                  }}
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg text-xs sm:text-sm font-medium transition flex items-center justify-center gap-1.5 sm:gap-2"
                >
                  <Edit2 size={12} className="sm:w-3.5 sm:h-3.5" />
                  Edit Profile
                </button>

                <div className="my-3 sm:my-4 border-t border-gray-100" />

                <div className="space-y-2 sm:space-y-3 text-left">
                  {user.phone && (
                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                      <Phone
                        size={14}
                        className="sm:w-4 sm:h-4 text-orange-500 flex-shrink-0"
                      />
                      <span className="truncate">{user.phone}</span>
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                      <MapPin
                        size={14}
                        className="sm:w-4 sm:h-4 text-orange-500 flex-shrink-0"
                      />
                      <span className="truncate">{user.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                    <Clock
                      size={14}
                      className="sm:w-4 sm:h-4 text-orange-500 flex-shrink-0"
                    />
                    <span>
                      Joined on{" "}
                      {user.joinedDate
                        ? new Date(user.joinedDate).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
                <TrendingUp
                  size={14}
                  className="sm:w-4 sm:h-4 text-orange-500"
                />
                Your Stats
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <StatBox icon={Calendar} label="Bookings" value="12" />
                <StatBox icon={Heart} label="Favorites" value="24" />
                <StatBox icon={BookMarked} label="Saved" value="18" />
                <StatBox icon={Award} label="Reviews" value="8" />
              </div>
            </div>

            {/* Achievement Badge - Hidden on small mobile */}
            <div className="hidden sm:block bg-gradient-to-br from-orange-50 to-red-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-orange-100">
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="text-white" size={16} />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-0.5 sm:mb-1">
                    Spiritual Explorer
                  </h3>
                  <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed">
                    You&apos;ve completed 12 sacred journeys. Keep exploring!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2">
                Welcome back, {user.name?.split(" ")[0]}! 🙏
              </h2>
              <p className="text-white/90 text-xs sm:text-sm">
                Your spiritual journey continues. Explore new destinations
                today.
              </p>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <QuickLink
                icon={Calendar}
                title="My Bookings"
                description="View upcoming trips"
                href="/profile/bookings"
              />
              <QuickLink
                icon={Heart}
                title="Favorites"
                description="Your saved items"
                href="/profile/favorites"
              />
              <QuickLink
                icon={BookMarked}
                title="Saved Places"
                description="Places to visit"
                href="/profile/saved"
              />
              <QuickLink
                icon={Settings}
                title="Settings"
                description="Account preferences"
                href="/profile/settings"
              />
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
                <Clock
                  size={16}
                  className="sm:w-4.5 sm:h-4.5 text-orange-500"
                />
                Recent Activity
              </h2>
              <div className="space-y-2 sm:space-y-3">
                <Activity
                  icon={Calendar}
                  title="Booked Ganga Aarti Experience"
                  description="Evening ceremony at Har Ki Pauri"
                  time="2 days ago"
                />
                <Activity
                  icon={Heart}
                  title="Added Kedarnath Trek to favorites"
                  description="7-day spiritual journey"
                  time="5 days ago"
                />
                <Activity
                  icon={Star}
                  title="Reviewed Rishikesh Yoga Retreat"
                  description="Rated 5 stars - Amazing experience!"
                  time="1 week ago"
                />
                <Activity
                  icon={Award}
                  title="Earned Spiritual Explorer Badge"
                  description="Completed 12 sacred journeys"
                  time="2 weeks ago"
                />
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
                <Sparkles
                  size={16}
                  className="sm:w-4.5 sm:h-4.5 text-orange-500"
                />
                Recommended For You
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <RecommendationCard
                  title="Badrinath Temple Tour"
                  description="4-day spiritual journey to the holy shrine"
                  image="/images/destinations/badrinath.jpg"
                />
                <RecommendationCard
                  title="Valley of Flowers Trek"
                  description="Witness nature&apos;s paradise in the Himalayas"
                  image="/images/destinations/valley-of-flowers.jpg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />

      {/* Photo Options / Preview Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {selectedImage ? "Preview Photo" : "Profile Picture"}
              </h3>
              <button
                onClick={() => {
                  setShowPhotoModal(false);
                  setSelectedImage(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="p-1 hover:bg-gray-100 rounded-full transition"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {selectedImage ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden ring-4 ring-orange-100">
                    <Image
                      src={selectedImage}
                      alt="Selected preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    This image will be automatically cropped to 400x400 pixels
                    with face detection
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      fileInputRef.current?.click();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Change
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Upload size={16} />
                    {isUploading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowPhotoModal(false);
                    fileInputRef.current?.click();
                  }}
                  className="w-full px-4 py-3 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-xl transition flex items-center gap-3"
                >
                  <Camera size={20} />
                  <span className="font-medium">Change Photo</span>
                </button>

                {user.image && (
                  <button
                    onClick={handleDeleteImage}
                    className="w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl transition flex items-center gap-3"
                  >
                    <Trash2 size={20} />
                    <span className="font-medium">Remove Photo</span>
                  </button>
                )}

                <button
                  onClick={() => setShowPhotoModal(false)}
                  className="w-full px-4 py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- SUBCOMPONENTS ---------- */

function StatBox({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
      <div className="text-lg sm:text-xl font-bold text-gray-900">{value}</div>
      <div className="text-[10px] sm:text-xs text-gray-500 flex items-center justify-center gap-1">
        <Icon size={10} className="sm:w-3 sm:h-3" />
        {label}
      </div>
    </div>
  );
}

function QuickLink({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(href)}
      className="flex items-center gap-3 p-3 sm:p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-orange-200 transition text-left"
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center flex-shrink-0">
        <Icon className="text-orange-600" size={18} />
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-500 truncate">
          {description}
        </p>
      </div>
    </button>
  );
}

function Activity({
  icon: Icon,
  title,
  description,
  time,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
        <Icon className="text-orange-500" size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 text-xs sm:text-sm truncate">
          {title}
        </h4>
        <p className="text-[10px] sm:text-xs text-gray-500 truncate">
          {description}
        </p>
      </div>
      <span className="text-[10px] sm:text-xs text-gray-400 flex-shrink-0">
        {time}
      </span>
    </div>
  );
}

function RecommendationCard({
  title,
  description,
  image,
}: {
  title: string;
  description: string;
  image: string;
}) {
  return (
    <div className="flex gap-3 p-3 bg-gray-50 rounded-xl hover:bg-orange-50 transition cursor-pointer">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
        <Image
          src={image}
          alt={title}
          width={80}
          height={80}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 text-xs sm:text-sm mb-0.5 sm:mb-1 truncate">
          {title}
        </h4>
        <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
}

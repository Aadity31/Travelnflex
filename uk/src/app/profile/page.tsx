"use client";

import { useState, useEffect, useRef } from "react";
import UserAvatar from "@/app/components/UserAvatar";
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
  ChevronRight,
  Sparkles,
  Star,
  TrendingUp,
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
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const widgetRef = useRef<any>();

  // ⭐ Cloudinary Widget Setup
  useEffect(() => {
    console.log("🔍 Checking for Cloudinary...");
    if (typeof window !== "undefined" && (window as any).cloudinary) {
      console.log("✅ Cloudinary found, creating widget..."); // ⭐ ADD
      widgetRef.current = (window as any).cloudinary.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
          sources: ["local", "camera"],
          multiple: false,
          maxFileSize: 5000000, // 5MB
          clientAllowedFormats: ["jpg", "png", "jpeg", "webp"],
          cropping: true,
          croppingAspectRatio: 1, // Square crop
          showSkipCropButton: false,
        },
        async (error: any, result: any) => {
          if (!error && result && result.event === "success") {
            const imageUrl = result.info.secure_url;

            setUploading(true);
            try {
              // Step 1: Fetch current user
              const userResponse = await fetch("/api/auth/user");
              const userData = await userResponse.json();

              // ⭐ Check if user exists
              if (!userData || !userData.user) {
                alert("❌ Please refresh the page and try again");
                setUploading(false);
                return;
              }

              const currentUser = userData.user;

              // ⭐ Validate required fields
              if (!currentUser.name || !currentUser.email) {
                console.error("❌ Missing user name/email:", currentUser);
                alert(
                  "❌ User profile incomplete. Please update your profile first."
                );
                setUploading(false);
                return;
              }

              console.log("🔍 Updating with data:", {
                name: currentUser.name,
                email: currentUser.email,
                phone: currentUser.phone || "0000000000",
              });

              // Step 2: Update profile
              const response = await fetch("/api/profile/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: currentUser.name,
                  email: currentUser.email,
                  phone: currentUser.phone || "0000000000",
                  traveller_type: currentUser.traveller_type || "indian",
                  passport_number: currentUser.passport_number || null,
                  image: imageUrl,
                }),
              });

              const data = await response.json();

              if (response.ok) {
                setUser((prev) => (prev ? { ...prev, image: imageUrl } : null));
                alert("✅ Profile picture updated!");
              } else {
                alert(`❌ Failed: ${data.error || "Unknown error"}`);
              }
            } catch (err) {
              alert(
                "❌ Error updating profile picture. Check console for details."
              );
            } finally {
              setUploading(false);
            }
          }

          if (error) {
            console.error("❌ Upload error:", error);
            alert("❌ Upload failed");
          }
        }
      );
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/user");
        const data = await res.json();

        if (data?.user) {
          setUser(data.user);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  // ⭐ Handle Camera Button Click
  const handleUploadClick = () => {
    console.log("🔍 Camera button clicked!"); // ⭐ ADD
    console.log("🔍 Widget ref:", widgetRef.current); // ⭐ ADD

    if (widgetRef.current) {
      console.log("✅ Opening widget..."); // ⭐ ADD
      widgetRef.current.open();
    } else {
      console.error("❌ Widget not ready!");
      alert("Upload widget not ready. Please refresh the page.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-3 text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT SIDEBAR - Profile Info */}
          <div className="lg:col-span-4 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header gradient */}
              <div className="h-24 bg-gradient-to-r from-orange-500 to-red-500 relative" />

              <div className="px-6 pb-6 -mt-12 text-center">
                {/* Profile Picture */}
                <div className="relative inline-block group mb-4">
                  <UserAvatar
                    name={user.name}
                    image={user.image}
                    size={96}
                    textSize="text-xl"
                    className="ring-4 ring-white bg-white shadow-lg"
                  />

                  {/* ⭐ Camera Button with Upload */}
                  <button
                    onClick={handleUploadClick}
                    disabled={uploading}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Change profile picture"
                  >
                    {uploading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Camera size={14} />
                    )}
                  </button>
                </div>

                {/* Name & Email */}
                <h1 className="text-xl font-bold text-gray-900 mb-1">
                  {user.name}
                </h1>
                <p className="text-gray-500 text-sm mb-4">{user.email}</p>

                {/* Edit Button */}
                <button
                  onClick={() => router.push("/profile/edit")}
                  className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                >
                  <Edit2 size={14} />
                  Edit Profile
                </button>

                {/* Divider */}
                <div className="my-4 border-t border-gray-100" />

                {/* Contact Info */}
                <div className="space-y-3 text-left">
                  {user.phone && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Phone
                        size={16}
                        className="text-orange-500 flex-shrink-0"
                      />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <MapPin
                        size={16}
                        className="text-orange-500 flex-shrink-0"
                      />
                      <span>{user.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Clock
                      size={16}
                      className="text-orange-500 flex-shrink-0"
                    />
                    <span>Joined {user.joinedDate || "December 2025"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-orange-500" />
                Your Stats
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <StatBox icon={Calendar} label="Bookings" value="12" />
                <StatBox icon={Heart} label="Favorites" value="24" />
                <StatBox icon={BookMarked} label="Saved" value="18" />
                <StatBox icon={Award} label="Reviews" value="8" />
              </div>
            </div>

            {/* Achievement Badge */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">
                    Spiritual Explorer
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    You&apos;ve completed 12 sacred journeys. Keep exploring the
                    divine!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-8 space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">
                Welcome back, {user.name?.split(" ")[0]}! 🙏
              </h2>
              <p className="text-white/90 text-sm">
                Your spiritual journey continues. Explore new destinations and
                activities today.
              </p>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock size={18} className="text-orange-500" />
                Recent Activity
              </h2>
              <div className="space-y-3">
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
                  icon={Award}
                  title="Reviewed Rajesh Kumar (Guide)"
                  description="Rated 5 stars for excellent service"
                  time="1 week ago"
                />
                <Activity
                  icon={BookMarked}
                  title="Saved Badrinath Temple"
                  description="Added to your travel wishlist"
                  time="1 week ago"
                />
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star size={18} className="text-orange-500" />
                Recommended For You
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <RecommendationCard
                  image="https://images.unsplash.com/photo-1585159812596-fac104f2f069?w=400"
                  title="Yoga Retreat in Rishikesh"
                  rating="4.9"
                  price="₹3,999"
                />
                <RecommendationCard
                  image="https://images.unsplash.com/photo-1548013146-72479768bada?w=400"
                  title="Char Dham Yatra Package"
                  rating="4.8"
                  price="₹12,999"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Box Component
function StatBox({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="text-center p-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-100 transition cursor-pointer">
      <Icon className="text-orange-500 mx-auto mb-1" size={18} />
      <p className="text-lg font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

// Quick Link Component
function QuickLink({
  icon: Icon,
  title,
  description,
  href,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center justify-between p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-orange-200 transition group"
    >
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition shadow-lg">
          <Icon className="text-white" size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-0.5">{title}</h3>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
      <ChevronRight
        className="text-gray-400 group-hover:text-orange-500 transition flex-shrink-0"
        size={18}
      />
    </a>
  );
}

// Activity Component
function Activity({
  icon: Icon,
  title,
  description,
  time,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition">
      <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="text-orange-500" size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-600 mt-0.5">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
}

// Recommendation Card Component
function RecommendationCard({
  image,
  title,
  rating,
  price,
}: {
  image: string;
  title: string;
  rating: string;
  price: string;
}) {
  return (
    <div className="group cursor-pointer">
      <div className="relative h-32 rounded-lg overflow-hidden mb-2">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition duration-300"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
          <Star size={12} className="text-orange-500 fill-orange-500" />
          <span className="text-xs font-semibold text-gray-900">{rating}</span>
        </div>
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm font-bold text-orange-600">{price}</p>
    </div>
  );
}

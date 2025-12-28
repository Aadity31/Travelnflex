"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";

type UserType = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  phone?: string;
  location?: string;
  bio?: string;
};

export default function EditProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/user");
        const data = await res.json();

        if (data?.user) {
          setUser(data.user);
          setFormData({
            name: data.user.name || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
            location: data.user.location || "",
            bio: data.user.bio || "",
          });
          setImagePreview(data.user.image || "/avatar.png");
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          image: imagePreview !== user?.image ? imagePreview : undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Profile updated successfully!");
        setTimeout(() => {
          router.push("/profile");
        }, 1000);
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
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
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition mb-4"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back to Profile</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
          <p className="text-gray-500 text-sm mt-1">
            Update your personal information
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Profile Image Section */}
            <div className="p-6 border-b border-gray-100">
              <label className="block text-sm font-semibold text-gray-900 mb-4">
                Profile Picture
              </label>
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-gray-100">
                    <Image
                      src={imagePreview}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label
                    htmlFor="image-upload"
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition"
                  >
                    <Camera className="text-white" size={24} />
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                <div>
                  <label
                    htmlFor="image-upload"
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium cursor-pointer inline-block transition"
                  >
                    Change Photo
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG or GIF. Max size 5MB
                  </p>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition"
                    placeholder="Dehradun, Uttarakhand"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition resize-none"
                  placeholder="Tell us about yourself..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.bio.length}/500 characters
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-medium transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

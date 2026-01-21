"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  User,
  Mail,
  Phone,
  Globe,
  CreditCard,
  Save,
  ArrowLeft,
  Shield,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-hot-toast";

type UserType = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  phone?: string;
  traveller_type?: string;
  passport_number?: string;
};

export default function EditProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true); // ✅ Added loading state
  const router = useRouter();
  const { update } = useSession();
  const hasFetched = useRef(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    traveller_type: "indian",
    passport_number: "",
  });

  // ✅ Combined Logic: Fetch Data & Handle Loading State
  useEffect(() => {
    if (hasFetched.current) return;

    const fetchUser = async () => {
      try {
        setIsLoading(true); // ✅ Start loading
        const res = await fetch("/api/auth/user");
        const data = await res.json();

        if (data?.user) {
          setUser(data.user);
          setFormData({
            name: data.user.name || "",
            phone: data.user.phone || "",
            traveller_type: data.user.traveller_type || "indian",
            passport_number: data.user.passport_number || "",
          });
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to load profile");
        router.push("/login");
      } finally {
        setIsLoading(false); // ✅ Always stop loading
        hasFetched.current = true;
      }
    };

    fetchUser();
  }, [router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const phoneValue = value.replace(/[^\d+\s-]/g, "");
      setFormData({ ...formData, [name]: phoneValue });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        await update();
        toast.success("Profile updated successfully! 🎉", {
          duration: 3000,
          icon: "✨",
          style: {
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            color: "#fff",
            fontWeight: "600",
            padding: "16px 24px",
            borderRadius: "16px",
            boxShadow: "0 8px 24px rgba(16, 185, 129, 0.4)",
          },
        });
        setTimeout(() => {
          router.push("/profile");
        }, 1000);
      } else {
        toast.error(data.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong");
    }
  };

  // ✅ Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-8 sm:py-8 lg:py-14">
        {/* Header Skeleton */}
        <div className="mb-6 space-y-4">
          <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse mb-4" />
          <div className="space-y-3">
            <div className="h-10 w-64 bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-24 w-full bg-gray-200 rounded-2xl animate-pulse" />
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Sidebar Skeleton - Desktop */}
          <div className="hidden lg:block space-y-6">
            <div className="h-48 bg-gray-200 rounded-3xl animate-pulse" />
            <div className="h-64 bg-gray-200 rounded-3xl animate-pulse" />
          </div>

          {/* Main Form Skeleton */}
          <div className="lg:col-span-2">
            <div className="bg-gray-200/80 backdrop-blur-xl rounded-3xl border border-gray-200 shadow-2xl animate-pulse h-[600px] sm:h-[700px]" />
            
            {/* Mobile Quick Tips Skeleton */}
            <div className="lg:hidden mt-6 h-48 bg-gray-200 rounded-3xl animate-pulse" />
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-8 sm:py-8 lg:py-14">
        {/* Header with Back Button */}
        <div className="mb-3 sm:mb-4 md:mb-5 lg:mb-6">
          {/* Back Button - Responsive */}
          <button
            onClick={() => {
              router.back();
            }}
            className="group inline-flex items-center justify-center sm:justify-start gap-0 sm:gap-1.5 md:gap-2 text-gray-600 hover:text-orange-600 transition-all mb-2 sm:mb-2.5 md:mb-3 bg-white/80 backdrop-blur-sm w-8 h-8 sm:w-auto sm:h-auto sm:px-3 md:px-4 sm:py-2 rounded-md sm:rounded-lg hover:shadow-md"
          >
            <ArrowLeft
              size={14}
              className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] group-hover:-translate-x-1 transition-transform"
            />
            <span className="hidden sm:inline text-xs md:text-sm font-semibold">
              Back
            </span>
          </button>

          {/* Edit Profile Header */}
          <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 md:gap-4 mb-2.5 sm:mb-3 md:mb-3.5">
            <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-lg xs:rounded-xl sm:rounded-xl md:rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <User className="text-white" size={14} />
            </div>
            <div>
              <h1 className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 leading-tight">
                Edit Your Profile
              </h1>
              <p className="text-[10px] xs:text-[11px] sm:text-xs md:text-sm lg:text-base text-gray-600 mt-0.5 sm:mt-1">
                Keep your information up to date
              </p>
            </div>
          </div>

          {/* Account Information Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/20 shadow-lg p-3 xs:p-3.5 sm:p-4 md:p-5">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
              <Shield
                size={14}
                className="xs:w-[15px] xs:h-[15px] sm:w-4 sm:h-4 text-orange-600"
              />
              <h3 className="text-[11px] xs:text-xs sm:text-sm md:text-base font-bold text-gray-900">
                Account Information
              </h3>
            </div>

            <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 mt-2 sm:mt-2.5 md:mt-3">
              <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 rounded-md sm:rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <Mail
                  size={13}
                  className="xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-gray-600"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[10px] xs:text-[11px] sm:text-xs text-gray-500">
                  Email Address
                </p>
                <p className="text-[11px] xs:text-xs sm:text-sm md:text-base font-semibold text-gray-900 truncate">
                  {user.email}
                </p>
              </div>

              <span className="text-[9px] xs:text-[10px] sm:text-[11px] px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-full bg-green-100 text-green-700 font-semibold whitespace-nowrap">
                Verified
              </span>
            </div>

            <p className="mt-1.5 sm:mt-2 text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs text-gray-500 leading-relaxed">
              Email address cannot be changed once the account is created.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Sidebar - Desktop Only */}
          <div className="hidden lg:block space-y-6">
            {/* Profile Security Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-xl shadow-gray-200/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <Shield className="text-green-600" size={20} />
                </div>
                <h3 className="font-bold text-gray-900">Profile Security</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Your profile information is encrypted and securely stored. We
                never share your data with third parties.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CheckCircle2 size={14} className="text-green-600" />
                  <span>End-to-end encryption</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CheckCircle2 size={14} className="text-green-600" />
                  <span>Secure data storage</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CheckCircle2 size={14} className="text-green-600" />
                  <span>GDPR compliant</span>
                </div>
              </div>
            </div>

            {/* Quick Tips Card */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-6 text-white shadow-xl shadow-orange-500/30">
              <h3 className="font-bold mb-2 text-lg">💡 Quick Tips</h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>
                    Use your real WhatsApp number for quick communication
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>
                    Select correct traveller type for accurate pricing
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Foreign travellers must provide passport details</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Form Area */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 shadow-xl sm:shadow-2xl shadow-gray-200/50 overflow-hidden">
                {/* Personal Information Section */}
                <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-100">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-orange-100 flex items-center justify-center">
                      <User
                        size={16}
                        className="sm:w-5 sm:h-5 text-orange-600"
                      />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-gray-900">
                        Personal Information
                      </h2>
                      <p className="text-[10px] sm:text-xs text-gray-500">
                        Your basic details
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <User
                          className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition"
                          size={16}
                        />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-xs sm:text-sm bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white outline-none transition-all text-gray-900 placeholder:text-gray-400 font-medium"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <Phone
                          className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition"
                          size={16}
                        />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-xs sm:text-sm bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white outline-none transition-all text-gray-900 placeholder:text-gray-400 font-medium"
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-1.5 sm:mt-2 flex items-center gap-1 sm:gap-1.5">
                        <CheckCircle2
                          size={10}
                          className="sm:w-3 sm:h-3 text-green-600"
                        />
                        We'll use this for booking confirmations
                      </p>
                    </div>

                    {/* DOB & Gender - COMMENTED OUT */}
                    {/* 
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                          Date of Birth <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="date_of_birth"
                          onChange={handleInputChange}
                          required
                          max={new Date().toISOString().split("T")[0]}
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white outline-none transition-all text-gray-900 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                          Gender <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="gender"
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm bg-gray-50 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white outline-none transition-all text-gray-900 font-medium cursor-pointer"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">👨 Male</option>
                          <option value="female">👩 Female</option>
                          <option value="other">🧑 Other</option>
                        </select>
                      </div>
                    </div>
                    */}
                  </div>
                </div>

                {/* Traveller Information Section */}
                <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-orange-50/50 to-transparent">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-100 flex items-center justify-center">
                      <Globe
                        size={16}
                        className="sm:w-5 sm:h-5 text-blue-600"
                      />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-gray-900">
                        Traveller Type
                      </h2>
                      <p className="text-[10px] sm:text-xs text-gray-500">
                        Select your category
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    {/* Traveller Category */}
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="traveller_type"
                        value={formData.traveller_type}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-gray-900 font-medium cursor-pointer"
                      >
                        <option value="indian">🇮🇳 Indian Traveller</option>
                        <option value="foreign">🌍 Foreign Traveller</option>
                      </select>
                    </div>

                    {/* Passport Number - Conditional */}
                    {formData.traveller_type === "foreign" && (
                      <div className="animate-fadeIn">
                        <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 sm:mb-2">
                          Passport Number{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                          <CreditCard
                            className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition"
                            size={16}
                          />
                          <input
                            type="text"
                            name="passport_number"
                            value={formData.passport_number}
                            onChange={handleInputChange}
                            required={formData.traveller_type === "foreign"}
                            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-xs sm:text-sm bg-white border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 font-medium uppercase"
                            placeholder="A1234567"
                          />
                        </div>
                        <p className="text-[10px] sm:text-xs text-orange-600 mt-1.5 sm:mt-2 flex items-center gap-1 sm:gap-1.5 font-medium">
                          <Shield size={10} className="sm:w-3 sm:h-3" />
                          Required for foreign travellers
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 sm:p-6 lg:p-8 bg-gray-50/50 border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        router.back();
                      }}
                      className="flex-1 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm border-2 border-gray-300 text-gray-700 rounded-lg sm:rounded-xl font-bold hover:bg-gray-100 hover:border-gray-400 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 sm:flex-[2] px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg sm:rounded-xl font-bold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-1.5 sm:gap-2"
                    >
                      <Save size={16} className="sm:w-4.5 sm:h-4.5" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* Mobile Quick Tips */}
            <div className="lg:hidden mt-4 sm:mt-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white shadow-xl shadow-orange-500/30">
              <h3 className="font-bold mb-2 sm:mb-3 text-base sm:text-lg flex items-center gap-2">
                <span>💡</span> Quick Tips
              </h3>
              <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm text-white/90">
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <span className="mt-0.5 sm:mt-1">•</span>
                  <span>
                    Use your real WhatsApp number for quick communication
                  </span>
                </li>
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <span className="mt-0.5 sm:mt-1">•</span>
                  <span>
                    Select correct traveller type for accurate pricing
                  </span>
                </li>
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <span className="mt-0.5 sm:mt-1">•</span>
                  <span>Foreign travellers must provide passport details</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

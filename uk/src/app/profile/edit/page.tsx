"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Globe,
  CreditCard,
  Save,
  ArrowLeft,
  Loader2,
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    traveller_type: "indian",
    passport_number: "",
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
            traveller_type: data.user.traveller_type || "indian",
            passport_number: data.user.passport_number || "",
          });
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
        body: JSON.stringify(formData),
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Desktop & Mobile Container */}
      <div className="max-w-6xl mx-auto px-4 py-8 lg:py-16">
        {/* Header */}
        <div className="mb-8 lg:mb-12">
          <button
            onClick={() => router.back()}
            className="group inline-flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-all mb-6 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-xl hover:shadow-md"
          >
            <ArrowLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-sm font-semibold">Back to Profile</span>
          </button>

          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <User className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Edit Your Profile
              </h1>
              <p className="text-gray-600 text-sm lg:text-base mt-1">
                Keep your information up to date
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Sidebar - Info Card (Hidden on mobile) */}
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
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl shadow-gray-200/50 overflow-hidden">
                {/* Personal Information Section */}
                <div className="p-6 lg:p-8 border-b border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                      <User size={20} className="text-orange-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        Personal Information
                      </h2>
                      <p className="text-xs text-gray-500">
                        Your basic details
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-900 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <User
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition"
                          size={18}
                        />
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white outline-none transition-all text-gray-900 placeholder:text-gray-400 font-medium"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-900 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <Mail
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition"
                          size={18}
                        />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white outline-none transition-all text-gray-900 placeholder:text-gray-400 font-medium"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-900 mb-2">
                        WhatsApp Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <Phone
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition"
                          size={18}
                        />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white outline-none transition-all text-gray-900 placeholder:text-gray-400 font-medium"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1.5">
                        <CheckCircle2 size={12} className="text-green-600" />
                        We&apos;ll use this for booking confirmations
                      </p>
                    </div>
                  </div>
                </div>

                {/* Traveller Information Section */}
                <div className="p-6 lg:p-8 bg-gradient-to-br from-orange-50/50 to-transparent">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <Globe size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        Traveller Type
                      </h2>
                      <p className="text-xs text-gray-500">
                        Select your category
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Traveller Category */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-900 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="traveller_type"
                        value={formData.traveller_type}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 text-sm bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-gray-900 font-medium cursor-pointer"
                      >
                        <option value="indian">🇮🇳 Indian Traveller</option>
                        <option value="foreign">🌍 Foreign Traveller</option>
                      </select>
                    </div>

                    {/* Passport Number - Conditional */}
                    {formData.traveller_type === "foreign" && (
                      <div className="animate-fadeIn">
                        <label className="block text-xs font-semibold text-gray-900 mb-2">
                          Passport Number{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                          <CreditCard
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition"
                            size={18}
                          />
                          <input
                            type="text"
                            name="passport_number"
                            value={formData.passport_number}
                            onChange={handleInputChange}
                            required={formData.traveller_type === "foreign"}
                            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all text-gray-900 placeholder:text-gray-400 font-medium uppercase"
                            placeholder="A1234567"
                          />
                        </div>
                        <p className="text-xs text-orange-600 mt-2 flex items-center gap-1.5 font-medium">
                          <Shield size={12} />
                          Required for foreign travellers
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 lg:p-8 bg-gray-50/50 border-t border-gray-100">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="flex-1 px-5 py-2.5 text-sm border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-100 hover:border-gray-400 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 sm:flex-[2] px-5 py-2.5 text-sm bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-bold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                      {saving ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* Mobile Quick Tips (Visible only on mobile) */}
            <div className="lg:hidden mt-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-6 text-white shadow-xl shadow-orange-500/30">
              <h3 className="font-bold mb-3 text-lg flex items-center gap-2">
                <span>💡</span> Quick Tips
              </h3>
              <ul className="space-y-2.5 text-sm text-white/90">
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
        </div>
      </div>
    </div>
  );
}

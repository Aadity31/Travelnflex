"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import {
  User,
  Bell,
  Lock,
  Globe,
  Eye,
  EyeOff,
  Shield,
  Trash2,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Settings as SettingsIcon,
} from "lucide-react";

type SettingsData = {
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  profilePublic: boolean;
  language: string;
  currency: string;
};

export default function SettingsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("notifications");

  const [settings, setSettings] = useState<SettingsData>({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    profilePublic: true,
    language: "en",
    currency: "INR",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleSaveNotifications = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Preferences saved successfully! 🎉", {
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
    } catch (error) {
      toast.error("Failed to save preferences");
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Password changed successfully! 🎉", {
        duration: 3000,
        icon: "🔒",
        style: {
          background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
          color: "#fff",
          fontWeight: "600",
          padding: "16px 24px",
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(16, 185, 129, 0.4)",
        },
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error("Failed to change password");
    }
  };

  const handleSavePreferences = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success("Preferences saved! 🎉", {
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
    } catch (error) {
      toast.error("Failed to save");
    } finally {
    }
  };

  const handleDeleteAccount = async () => {
    const confirmText = prompt('Type "DELETE" to confirm:');
    if (confirmText !== "DELETE") {
      toast.error("Deletion cancelled");
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Account deletion requested");
      setTimeout(() => router.push("/"), 1000);
    } catch (error) {
      toast.error("Failed to delete account");
    } finally {
    }
  };

  const tabs = [
    { id: "profile", label: "Edit Profile", icon: User }, // ✅ Add this
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Lock },
    { id: "preferences", label: "Preferences", icon: Globe },
    { id: "privacy", label: "Privacy", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-8 sm:py-10 lg:py-12">
        {/* Header with Back Button */}
        <div className="mb-3 xs:mb-3.5 sm:mb-4 md:mb-5 lg:mb-6">
          {/* Back Button */}
          <button
            onClick={() => {
              router.back();
            }}
            className="group inline-flex items-center justify-center sm:justify-start gap-0 sm:gap-1 md:gap-1.5 lg:gap-2 text-gray-600 hover:text-orange-600 transition-all mb-2 xs:mb-2.5 sm:mb-3 md:mb-3 bg-white/80 backdrop-blur-sm w-7 h-7 xs:w-8 xs:h-8 sm:w-auto sm:h-auto sm:px-2.5 md:px-3 lg:px-4 sm:py-1.5 md:py-2 rounded-md sm:rounded-lg hover:shadow-md"
          >
            <ArrowLeft
              size={12}
              className="xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] group-hover:-translate-x-1 transition-transform"
            />
            <span className="hidden sm:inline text-[10px] xs:text-[11px] sm:text-xs md:text-sm font-semibold">
              Back
            </span>
          </button>

          {/* Settings Header */}
          <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 md:gap-3 lg:gap-4">
            <div className="w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 rounded-md xs:rounded-lg sm:rounded-xl md:rounded-xl lg:rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <SettingsIcon className="text-white w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-[18px] sm:h-[18px] md:w-5 md:h-5" />
            </div>
            <div>
              <h1 className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-gray-900 leading-tight">
                Account Settings
              </h1>
              <p className="text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs lg:text-sm xl:text-base text-gray-600 mt-0.5 sm:mt-1">
                Manage your account preferences
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-3 xs:gap-3.5 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8">
          {/* Left Sidebar - Desktop Only */}
          <div className="hidden lg:block space-y-4 xl:space-y-6 sticky top-24 self-start">
            {/* Settings Navigation Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl xl:rounded-3xl p-4 xl:p-6 border border-white/20 shadow-xl shadow-gray-200/50">
              <h3 className="text-xs xl:text-sm font-bold text-gray-900 mb-3 xl:mb-4 flex items-center gap-2">
                <SettingsIcon
                  size={14}
                  className="xl:w-4 xl:h-4 text-orange-600"
                />
                Settings Menu
              </h3>
              <div className="space-y-1.5 xl:space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-2 xl:gap-3 px-3 xl:px-4 py-2 xl:py-3 rounded-lg xl:rounded-xl text-left transition text-xs xl:text-sm font-semibold ${
                        isActive
                          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={16} className="xl:w-[18px] xl:h-[18px]" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Tips Card */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl xl:rounded-3xl p-4 xl:p-6 text-white shadow-xl shadow-orange-500/30">
              <h3 className="font-bold mb-2 xl:mb-3 text-base xl:text-lg">
                💡 Quick Tips
              </h3>
              <ul className="space-y-1.5 xl:space-y-2 text-xs xl:text-sm text-white/90">
                <li className="flex items-start gap-1.5 xl:gap-2">
                  <span className="mt-0.5 xl:mt-1">•</span>
                  <span>Keep your profile updated for better service</span>
                </li>
                <li className="flex items-start gap-1.5 xl:gap-2">
                  <span className="mt-0.5 xl:mt-1">•</span>
                  <span>Enable notifications for booking updates</span>
                </li>
                <li className="flex items-start gap-1.5 xl:gap-2">
                  <span className="mt-0.5 xl:mt-1">•</span>
                  <span>Use a strong password with 8+ characters</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Mobile Tabs */}
            <div className="lg:hidden mb-3 xs:mb-3.5 sm:mb-4 md:mb-5 bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/20 shadow-lg p-1.5 xs:p-2">
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-1.5 xs:gap-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex flex-col items-center gap-1 xs:gap-1.5 px-2 xs:px-2.5 sm:px-3 py-2 xs:py-2.5 rounded-lg sm:rounded-xl text-left transition ${
                        isActive
                          ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon
                        size={16}
                        className="xs:w-[18px] xs:h-[18px] sm:w-5 sm:h-5"
                      />
                      <span className="text-[9px] xs:text-[10px] sm:text-xs font-semibold text-center leading-tight">
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl border border-white/20 shadow-xl sm:shadow-2xl shadow-gray-200/50 overflow-hidden">
              {/* EDIT PROFILE TAB - COMPACT */}
              {activeTab === "profile" && (
                <div className="p-3 xs:p-3.5 sm:p-4 md:p-5 lg:p-6 xl:p-8">
                  <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 mb-3 xs:mb-3.5 sm:mb-4 md:mb-5">
                    <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-md xs:rounded-lg sm:rounded-xl bg-blue-100 flex items-center justify-center">
                      <User
                        size={12}
                        className="xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] text-blue-600"
                      />
                    </div>
                    <div>
                      <h2 className="text-xs xs:text-sm sm:text-base md:text-lg font-bold text-gray-900 leading-tight">
                        Edit Profile
                      </h2>
                      <p className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs text-gray-500 leading-tight">
                        Update your personal information
                      </p>
                    </div>
                  </div>

                  {/* Profile Info Cards - Compact Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 xs:gap-2.5 sm:gap-3 md:gap-3.5">
                    {/* Name Card */}
                    <div className="bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 p-2 xs:p-2.5 sm:p-3 hover:border-orange-300 transition">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 xs:w-8 xs:h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                          <User
                            size={14}
                            className="xs:w-[15px] xs:h-[15px] text-gray-600"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[8px] xs:text-[9px] sm:text-[10px] text-gray-500 leading-tight">
                            Full Name
                          </p>
                          <p className="text-[10px] xs:text-[11px] sm:text-xs md:text-sm font-semibold text-gray-900 truncate">
                            {session?.user?.name || "Not set"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Email Card */}
                    <div className="bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 p-2 xs:p-2.5 sm:p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 xs:w-8 xs:h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                          <Bell
                            size={14}
                            className="xs:w-[15px] xs:h-[15px] text-gray-600"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[8px] xs:text-[9px] sm:text-[10px] text-gray-500 leading-tight">
                            Email
                          </p>
                          <p className="text-[10px] xs:text-[11px] sm:text-xs md:text-sm font-semibold text-gray-900 truncate">
                            {session?.user?.email || "Not set"}
                          </p>
                        </div>
                        <span className="text-[7px] xs:text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold whitespace-nowrap">
                          ✓
                        </span>
                      </div>
                    </div>

                    {/* Phone Card */}
                    <div className="bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 p-2 xs:p-2.5 sm:p-3 hover:border-orange-300 transition sm:col-span-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 xs:w-8 xs:h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                          <Lock
                            size={14}
                            className="xs:w-[15px] xs:h-[15px] text-gray-600"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[8px] xs:text-[9px] sm:text-[10px] text-gray-500 leading-tight">
                            Phone Number
                          </p>
                          <p className="text-[10px] xs:text-[11px] sm:text-xs md:text-sm font-semibold text-gray-900">
                            +91 XXXXX XXXXX
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Go to Full Edit Page Button - Compact */}
                  <button
                    onClick={() => {
                      router.push("/profile/edit");
                    }}
                    className="mt-3 xs:mt-3.5 sm:mt-4 md:mt-5 w-full px-3 xs:px-4 sm:px-5 py-2 xs:py-2.5 sm:py-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg sm:rounded-xl font-bold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all text-[10px] xs:text-[11px] sm:text-xs md:text-sm flex items-center justify-center gap-1.5"
                  >
                    <User
                      size={14}
                      className="xs:w-[15px] xs:h-[15px] sm:w-4 sm:h-4"
                    />
                    <span>Edit Full Profile</span>
                  </button>

                  {/* Info Box - Compact */}
                  <div className="mt-2.5 xs:mt-3 sm:mt-3.5 bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-2 xs:p-2.5 sm:p-3">
                    <div className="flex items-start gap-1.5 xs:gap-2">
                      <CheckCircle2
                        size={12}
                        className="xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 text-blue-600 mt-0.5 flex-shrink-0"
                      />
                      <p className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs text-blue-700 leading-relaxed">
                        Click above to edit details like date of birth, gender,
                        traveller type, and passport information.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS TAB */}
              {activeTab === "notifications" && (
                <div className="p-3 xs:p-3.5 sm:p-4 md:p-5 lg:p-6 xl:p-8">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-orange-100 flex items-center justify-center">
                      <Bell
                        size={16}
                        className="sm:w-5 sm:h-5 text-orange-600"
                      />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-gray-900">
                        Notifications
                      </h2>
                      <p className="text-[10px] sm:text-xs text-gray-500">
                        Choose how you want to be notified
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <ToggleItem
                      label="Email Notifications"
                      description="Receive booking confirmations and updates"
                      checked={settings.emailNotifications}
                      onChange={(checked) =>
                        setSettings({
                          ...settings,
                          emailNotifications: checked,
                        })
                      }
                    />
                    <ToggleItem
                      label="SMS Notifications"
                      description="Get text alerts for important updates"
                      checked={settings.smsNotifications}
                      onChange={(checked) =>
                        setSettings({ ...settings, smsNotifications: checked })
                      }
                    />
                    <ToggleItem
                      label="Marketing Emails"
                      description="Receive special offers and newsletters"
                      checked={settings.marketingEmails}
                      onChange={(checked) =>
                        setSettings({ ...settings, marketingEmails: checked })
                      }
                    />
                  </div>

                  <button
                    onClick={handleSaveNotifications}
                    className="mt-4 xs:mt-5 sm:mt-5 md:mt-6 w-full sm:w-auto px-4 xs:px-5 sm:px-5 md:px-6 py-2 xs:py-2.5 sm:py-2.5 md:py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg sm:rounded-xl font-bold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all text-xs xs:text-xs sm:text-sm md:text-sm flex items-center justify-center gap-1.5 xs:gap-2"
                  >
                    <CheckCircle2
                      size={16}
                      className="xs:w-[17px] xs:h-[17px] sm:w-[18px] sm:h-[18px]"
                    />
                    <span>Save Preferences</span>
                  </button>
                </div>
              )}

              {/* SECURITY TAB */}
              {activeTab === "security" && (
                <div className="p-3 xs:p-3.5 sm:p-4 md:p-5 lg:p-6 xl:p-8">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-100 flex items-center justify-center">
                      <Lock size={16} className="sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-gray-900">
                        Security
                      </h2>
                      <p className="text-[10px] sm:text-xs text-gray-500">
                        Update your password
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                        Current Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <Lock
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition"
                          size={16}
                        />
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-12 py-2.5 text-sm bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white outline-none transition-all text-gray-900 placeholder:text-gray-400 font-medium"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              current: !showPasswords.current,
                            })
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.current ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                        New Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <Lock
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition"
                          size={16}
                        />
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-12 py-2.5 text-sm bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white outline-none transition-all text-gray-900 placeholder:text-gray-400 font-medium"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              new: !showPasswords.new,
                            })
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.new ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                        Confirm New Password{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative group">
                        <Lock
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition"
                          size={16}
                        />
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-12 py-2.5 text-sm bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white outline-none transition-all text-gray-900 placeholder:text-gray-400 font-medium"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              confirm: !showPasswords.confirm,
                            })
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.confirm ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleChangePassword}
                    className="mt-6 w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-bold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all text-sm flex items-center justify-center gap-2"
                  >
                    <Lock size={18} />
                    <span>Change Password</span>
                  </button>
                </div>
              )}

              {/* PREFERENCES TAB */}
              {activeTab === "preferences" && (
                <div className="p-3 xs:p-3.5 sm:p-4 md:p-5 lg:p-6 xl:p-8">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-purple-100 flex items-center justify-center">
                      <Globe
                        size={16}
                        className="sm:w-5 sm:h-5 text-purple-600"
                      />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-gray-900">
                        Preferences
                      </h2>
                      <p className="text-[10px] sm:text-xs text-gray-500">
                        Customize your experience
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                        Language <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={settings.language}
                        onChange={(e) =>
                          setSettings({ ...settings, language: e.target.value })
                        }
                        className="w-full px-4 py-2.5 text-sm bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white outline-none transition-all text-gray-900 font-medium cursor-pointer"
                      >
                        <option value="en">🇬🇧 English</option>
                        <option value="hi">🇮🇳 हिन्दी (Hindi)</option>
                        <option value="mr">🇮🇳 मराठी (Marathi)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-semibold text-gray-900 mb-2">
                        Currency <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={settings.currency}
                        onChange={(e) =>
                          setSettings({ ...settings, currency: e.target.value })
                        }
                        className="w-full px-4 py-2.5 text-sm bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white outline-none transition-all text-gray-900 font-medium cursor-pointer"
                      >
                        <option value="INR">₹ INR - Indian Rupee</option>
                        <option value="USD">$ USD - US Dollar</option>
                        <option value="EUR">€ EUR - Euro</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleSavePreferences}
                    className="mt-6 w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-bold shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all text-sm flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={18} />
                    <span>Save Preferences</span>
                  </button>
                </div>
              )}

              {/* PRIVACY TAB */}
              {activeTab === "privacy" && (
                <div className="p-3 xs:p-3.5 sm:p-4 md:p-5 lg:p-6 xl:p-8">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-green-100 flex items-center justify-center">
                      <Shield
                        size={16}
                        className="sm:w-5 sm:h-5 text-green-600"
                      />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-gray-900">
                        Privacy & Data
                      </h2>
                      <p className="text-[10px] sm:text-xs text-gray-500">
                        Control your privacy settings
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <ToggleItem
                      label="Public Profile"
                      description="Allow others to view your profile"
                      checked={settings.profilePublic}
                      onChange={(checked) =>
                        setSettings({ ...settings, profilePublic: checked })
                      }
                    />
                  </div>

                  {/* Danger Zone */}
                  <div className="border-2 border-red-200 bg-red-50 rounded-xl p-4 sm:p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                        <AlertTriangle size={20} className="text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-red-900">
                          Danger Zone
                        </h3>
                        <p className="text-xs sm:text-sm text-red-700 mt-1">
                          Permanently delete your account and all data. This
                          action cannot be undone.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleDeleteAccount}
                      className="w-full sm:w-auto px-5 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/40"
                    >
                      <Trash2 size={18} />
                      <span>Delete Account</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Quick Tips */}
            <div className="lg:hidden mt-4 xs:mt-5 sm:mt-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl sm:rounded-3xl p-4 xs:p-5 sm:p-6 text-white shadow-xl shadow-orange-500/30">
              <h3 className="font-bold mb-2 xs:mb-2.5 sm:mb-3 text-sm xs:text-base sm:text-lg flex items-center gap-2">
                <span>💡</span> Quick Tips
              </h3>
              <ul className="space-y-1.5 xs:space-y-2 sm:space-y-2.5 text-[10px] xs:text-[11px] sm:text-xs md:text-sm text-white/90">
                <li className="flex items-start gap-1.5 xs:gap-2">
                  <span className="mt-0.5">•</span>
                  <span>Keep your profile updated for better service</span>
                </li>
                <li className="flex items-start gap-1.5 xs:gap-2">
                  <span className="mt-0.5">•</span>
                  <span>Enable notifications for booking updates</span>
                </li>
                <li className="flex items-start gap-1.5 xs:gap-2">
                  <span className="mt-0.5">•</span>
                  <span>Use a strong password with 8+ characters</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleItem({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 xs:py-3 sm:py-3.5 md:py-4 px-2.5 xs:px-3 sm:px-3.5 md:px-4 bg-gray-50 rounded-lg sm:rounded-xl border-2 border-gray-200 hover:border-orange-200 transition">
      <div className="flex-1 pr-2 xs:pr-3 sm:pr-4">
        <h4 className="text-xs xs:text-xs sm:text-sm md:text-sm font-semibold text-gray-900">
          {label}
        </h4>
        <p className="text-[9px] xs:text-[10px] sm:text-[11px] md:text-xs text-gray-600 mt-0.5 xs:mt-1">
          {description}
        </p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 xs:w-11 xs:h-6 sm:w-12 sm:h-6 rounded-full transition flex-shrink-0 ${
          checked ? "bg-orange-500" : "bg-gray-300"
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-4 h-4 xs:w-5 xs:h-5 bg-white rounded-full transition transform shadow-md ${
            checked
              ? "translate-x-5 xs:translate-x-5 sm:translate-x-6"
              : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

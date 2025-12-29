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
  ChevronLeft,
  AlertTriangle,
  Edit3,
  ChevronRight,
  Menu,
  X,
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
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("notifications");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  const handleSaveNotifications = () => {
    toast.success("Preferences saved successfully!");
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    toast.success("Password changed successfully!");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleDeleteAccount = () => {
    const confirmText = prompt('Type "DELETE" to confirm:');
    if (confirmText !== "DELETE") {
      toast.error("Deletion cancelled");
      return;
    }
    toast.success("Account deletion requested");
  };

  const tabs = [
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Lock },
    { id: "preferences", label: "Preferences", icon: Globe },
    { id: "privacy", label: "Privacy", icon: Shield },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16 sm:pt-20 pb-6 sm:pb-8 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => router.push("/profile")}
            className="flex items-center gap-1.5 sm:gap-2 text-gray-600 hover:text-orange-600 mb-3 sm:mb-4 transition"
          >
            <ChevronLeft size={16} className="sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-medium">
              Back to Profile
            </span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                Settings
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
                Manage your account preferences
              </p>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition"
            >
              {mobileMenuOpen ? (
                <X size={20} className="text-gray-700" />
              ) : (
                <Menu size={20} className="text-gray-700" />
              )}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-1.5 sm:p-2 sticky top-20">
              {/* Edit Profile Link */}
              <button
                onClick={() => router.push("/profile/edit")}
                className="w-full flex items-center justify-between px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg text-left transition bg-blue-500 text-white hover:bg-blue-600 mb-1.5 sm:mb-2"
              >
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Edit3 size={14} className="sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-semibold">
                    Edit Profile
                  </span>
                </div>
                <ChevronRight size={14} className="sm:w-4 sm:h-4" />
              </button>

              {/* Tabs */}
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg text-left transition text-xs sm:text-sm font-medium ${
                      isActive
                        ? "bg-orange-500 text-white"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={14} className="sm:w-4 sm:h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Sidebar Menu */}
          {mobileMenuOpen && (
            <div
              className="lg:hidden fixed inset-0 z-50 bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div
                className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-xl p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-900">Menu</h3>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-1">
                  {/* Edit Profile */}
                  <button
                    onClick={() => {
                      router.push("/profile/edit");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition bg-blue-500 text-white hover:bg-blue-600 mb-2"
                  >
                    <div className="flex items-center gap-2">
                      <Edit3 size={16} />
                      <span className="text-sm font-semibold">
                        Edit Profile
                      </span>
                    </div>
                    <ChevronRight size={16} />
                  </button>

                  {/* Tabs */}
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition text-sm font-medium ${
                          isActive
                            ? "bg-orange-500 text-white"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <Icon size={16} />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              {/* NOTIFICATIONS */}
              {activeTab === "notifications" && (
                <div>
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                    <Bell size={16} className="sm:w-5 sm:h-5 text-orange-500" />
                    <h2 className="text-base sm:text-lg font-bold text-gray-900">
                      Notifications
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                    Choose how you want to be notified
                  </p>

                  <div className="space-y-3 sm:space-y-4">
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
                    className="mt-4 sm:mt-6 w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition text-xs sm:text-sm"
                  >
                    Save Preferences
                  </button>
                </div>
              )}

              {/* SECURITY */}
              {activeTab === "security" && (
                <div>
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                    <Lock size={16} className="sm:w-5 sm:h-5 text-orange-500" />
                    <h2 className="text-base sm:text-lg font-bold text-gray-900">
                      Security
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                    Update your password
                  </p>

                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value,
                            })
                          }
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
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
                          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.current ? (
                            <EyeOff size={14} className="sm:w-4 sm:h-4" />
                          ) : (
                            <Eye size={14} className="sm:w-4 sm:h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
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
                          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.new ? (
                            <EyeOff size={14} className="sm:w-4 sm:h-4" />
                          ) : (
                            <Eye size={14} className="sm:w-4 sm:h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
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
                          className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.confirm ? (
                            <EyeOff size={14} className="sm:w-4 sm:h-4" />
                          ) : (
                            <Eye size={14} className="sm:w-4 sm:h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleChangePassword}
                    className="mt-4 sm:mt-6 w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition text-xs sm:text-sm"
                  >
                    Change Password
                  </button>
                </div>
              )}

              {/* PREFERENCES */}
              {activeTab === "preferences" && (
                <div>
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                    <Globe
                      size={16}
                      className="sm:w-5 sm:h-5 text-orange-500"
                    />
                    <h2 className="text-base sm:text-lg font-bold text-gray-900">
                      Preferences
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                    Customize your experience
                  </p>

                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                        Language
                      </label>
                      <select
                        value={settings.language}
                        onChange={(e) =>
                          setSettings({ ...settings, language: e.target.value })
                        }
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      >
                        <option value="en">English</option>
                        <option value="hi">हिन्दी (Hindi)</option>
                        <option value="mr">मराठी (Marathi)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                        Currency
                      </label>
                      <select
                        value={settings.currency}
                        onChange={(e) =>
                          setSettings({ ...settings, currency: e.target.value })
                        }
                        className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                      >
                        <option value="INR">₹ INR - Indian Rupee</option>
                        <option value="USD">$ USD - US Dollar</option>
                        <option value="EUR">€ EUR - Euro</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => toast.success("Preferences saved!")}
                    className="mt-4 sm:mt-6 w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition text-xs sm:text-sm"
                  >
                    Save Preferences
                  </button>
                </div>
              )}

              {/* PRIVACY */}
              {activeTab === "privacy" && (
                <div>
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                    <Shield
                      size={16}
                      className="sm:w-5 sm:h-5 text-orange-500"
                    />
                    <h2 className="text-base sm:text-lg font-bold text-gray-900">
                      Privacy & Data
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                    Control your privacy settings
                  </p>

                  <div className="mb-4 sm:mb-6">
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
                  <div className="border-2 border-red-200 bg-red-50 rounded-lg p-3 sm:p-4">
                    <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <AlertTriangle
                        size={16}
                        className="sm:w-5 sm:h-5 text-red-600 mt-0.5"
                      />
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-red-900">
                          Danger Zone
                        </h3>
                        <p className="text-[10px] sm:text-xs text-red-700 mt-0.5">
                          Permanently delete your account and all data
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleDeleteAccount}
                      className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2"
                    >
                      <Trash2 size={14} className="sm:w-4 sm:h-4" />
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Toggle Component
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
    <div className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1 pr-3 sm:pr-4">
        <h4 className="text-xs sm:text-sm font-semibold text-gray-900">
          {label}
        </h4>
        <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5">
          {description}
        </p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 sm:w-11 sm:h-6 rounded-full transition flex-shrink-0 ${
          checked ? "bg-orange-500" : "bg-gray-300"
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full transition transform ${
            checked ? "translate-x-5 sm:translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

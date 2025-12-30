"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";

type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "booking" | "reminder" | "update" | "promo";
};

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Booking Confirmed",
      message: "Your Kedarnath trek booking is confirmed",
      timestamp: "2 min ago",
      read: false,
      type: "booking",
    },
    {
      id: "2",
      title: "Reminder",
      message: "Your Ganga Aarti starts in 2 hours",
      timestamp: "1 hour ago",
      read: false,
      type: "reminder",
    },
    {
      id: "3",
      title: "Special Offer",
      message: "20% off on Char Dham Yatra packages",
      timestamp: "3 hours ago",
      read: true,
      type: "promo",
    },
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "booking":
        return "bg-green-100/80 text-green-600 dark:bg-green-500/20 dark:text-green-400 backdrop-blur-sm";
      case "reminder":
        return "bg-blue-100/80 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 backdrop-blur-sm";
      case "update":
        return "bg-orange-100/80 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 backdrop-blur-sm";
      case "promo":
        return "bg-purple-100/80 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 backdrop-blur-sm";
      default:
        return "bg-gray-100/80 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400 backdrop-blur-sm";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:text-orange-600 dark:text-white dark:hover:text-orange-500 rounded-lg transition-all"
        aria-label="Notifications"
      >
        <Bell size={18} className="sm:w-5 sm:h-5" />

        {/* Badge - Unread Count */}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="fixed lg:absolute top-0 right-0 lg:top-auto lg:right-0 lg:mt-3 w-full h-full lg:h-auto lg:w-80 xl:w-96 rounded-2xl backdrop-blur-md bg-white/80 dark:bg-slate-900/80 shadow-2xl border border-white/20 dark:border-gray-700/50 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="px-4 py-4 bg-gradient-to-br from-orange-500/10 to-red-600/10 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                  Notifications
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                  {unreadCount > 0
                    ? `${unreadCount} unread`
                    : "All caught up! 🎉"}
                </p>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[10px] sm:text-xs text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 font-semibold px-2 py-1 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition"
                  >
                    Mark all
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition text-gray-700 dark:text-gray-300"
                  aria-label="Close"
                >
                  <X size={16} className="sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="h-[calc(100vh-140px)] lg:max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-8 sm:p-12 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-gray-100/80 dark:bg-gray-800/50 backdrop-blur-sm flex items-center justify-center">
                  <Bell
                    size={28}
                    className="sm:w-9 sm:h-9 text-gray-300 dark:text-gray-600"
                  />
                </div>
                <p className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  No notifications
                </p>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500">
                  We'll notify you when something arrives
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 sm:p-4 hover:bg-orange-500/10 dark:hover:bg-orange-500/20 transition-colors cursor-pointer backdrop-blur-sm ${
                      !notification.read
                        ? "bg-orange-50/40 dark:bg-orange-500/10"
                        : "bg-transparent"
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      {/* Type Badge */}
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${getTypeStyles(
                          notification.type
                        )}`}
                      >
                        <Bell size={14} className="sm:w-3.5 sm:h-3.5" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-500 rounded-full flex-shrink-0 mt-1 animate-pulse" />
                          )}
                        </div>
                        <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-300 mt-0.5 sm:mt-1 line-clamp-2 leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {notification.timestamp}
                        </p>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="p-1 sm:p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg transition flex-shrink-0"
                        aria-label="Delete notification"
                      >
                        <Trash2 size={13} className="sm:w-3.5 sm:h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 sm:p-4 border-t border-gray-200/50 dark:border-gray-700/50 text-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push("/notifications");
                }}
                className="text-xs sm:text-sm text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 font-semibold px-4 py-2 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition"
              >
                View all notifications →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

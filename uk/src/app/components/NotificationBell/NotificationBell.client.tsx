"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Trash2 } from "lucide-react";
import type { Notification } from "@/types/notification";

interface NotificationBellProps {
  initialNotifications: Notification[];
}

export default function NotificationBellClient({
  initialNotifications,
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // 🔴 DUMMY: Real-time updates simulation
  useEffect(() => {
    const simulateNewNotification = setInterval(() => {
      if (Math.random() > 0.7) {
        const dummyNotification: Notification = {
          id: Date.now().toString(),
          title: "New Update",
          message: "This is a simulated notification",
          timestamp: "Just now",
          read: false,
          type: "update",
        };
        setNotifications((prev) => [dummyNotification, ...prev]);
      }
    }, 30000);

    return () => clearInterval(simulateNewNotification);
  }, []);

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

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = async (id: string) => {
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
      {/* Bell Button - Responsive size */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1.5 sm:p-2 text-white hover:text-orange-600 dark:text-white dark:hover:text-orange-500 rounded-lg transition-all"
        aria-label="Notifications"
      >
        <Bell size={20} className="sm:w-[20px] sm:h-[20px]" />

        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-[8px] sm:text-[10px] font-bold rounded-full flex items-center justify-center ">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu - Fully Responsive */}
      {isOpen && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-md max-h-[60vh] sm:absolute sm:top-full sm:right-0 sm:left-auto sm:translate-x-0 sm:w-[350px] sm:max-h-[400px] lg:w-90 2xl:w-98 pb-2 sm:pb-3 mt-0 sm:mt-5 rounded-2xl backdrop-blur-md bg-white/90 dark:bg-slate-900/90 shadow-2xl border border-white/20 dark:border-gray-700/50  z-50 flex flex-col overflow-hidden">
          {/* Header - Responsive padding */}
          <div className="px-3 py-3 sm:px-4 sm:py-4 bg-gradient-to-br from-orange-500/10 to-red-600/10 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm xl:text-base font-bold text-gray-900 dark:text-white">
                  Notifications
                </h3>
                {/* <p className="text-[9px] sm:text-[10px] xl:text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                  {unreadCount > 0
                    ? `${unreadCount} Unread`
                    : "All caught up! 🎉"}
                </p> */}
              </div>

              <div className="flex items-center gap-1 sm:gap-1.5 xl:gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[9px] sm:text-[10px] xl:text-xs text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 font-semibold px-1.5 py-1 sm:px-2 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition"
                  >
                    Mark all as read
                  </button>
                )}
                {unreadCount === 0 && (
                  <span className="text-[9px] sm:text-[10px] xl:text-xs text-gray-500 dark:text-gray-400 px-1.5 py-1 sm:px-2">
                    You&apos;re all caught up!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Notifications List - Responsive height */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-6 sm:p-8 xl:p-6 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 xl:w-14 xl:h-14 mx-auto mb-2 sm:mb-3 rounded-full bg-gray-100/80 dark:bg-gray-800/50 backdrop-blur-sm flex items-center justify-center">
                  <Bell
                    size={18}
                    className="sm:w-5 sm:h-5 xl:w-6 xl:h-6 text-gray-300 dark:text-gray-600"
                  />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  No notifications
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-500">
                  We&apos;ll notify you when something arrives
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-2 sm:p-2.5 xl:p-3 hover:bg-orange-500/10 dark:hover:bg-orange-500/20 transition-colors cursor-pointer backdrop-blur-sm ${
                      !notification.read
                        ? "bg-orange-50/40 dark:bg-orange-500/10"
                        : "bg-transparent"
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-1.5 sm:gap-2">
                      {/* Type Badge - Responsive */}
                      <div
                        className={`w-6 h-6 sm:w-7 sm:h-7 xl:w-8 xl:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getTypeStyles(
                          notification.type
                        )}`}
                      >
                        <Bell size={10} className="sm:w-3 sm:h-3" />
                      </div>

                      {/* Content - Responsive text */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1.5 sm:gap-2">
                          <h4 className="text-[10px] sm:text-[11px] xl:text-xs font-semibold text-gray-900 dark:text-white truncate">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0 mt-0.5 sm:mt-1 animate-pulse" />
                          )}
                        </div>
                        <p className="text-[9px] sm:text-[10px] xl:text-[11px] text-gray-600 dark:text-gray-300 mt-0.5 line-clamp-2 leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="text-[8px] sm:text-[9px] xl:text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                          {notification.timestamp}
                        </p>
                      </div>

                      {/* Delete Button - Responsive */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="p-0.5 sm:p-1 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg transition flex-shrink-0"
                        aria-label="Delete notification"
                      >
                        <Trash2 size={10} className="sm:w-3 sm:h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer - Responsive */}
          {/* 
          {notifications.length > 0 && (
            <div className="p-2.5 sm:p-3 xl:p-4 border-t border-gray-200/50 dark:border-gray-700/50 text-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
              <button
                onClick={() => {
                  setIsOpen(false);
                  router.push("/notifications");
                }}
                className="text-[10px] sm:text-xs xl:text-sm text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 font-semibold px-3 py-1.5 sm:px-4 sm:py-2 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition"
              >
                View all notifications →
              </button>
            </div>
          )}
          */}
        </div>
      )}
    </div>
  );
}

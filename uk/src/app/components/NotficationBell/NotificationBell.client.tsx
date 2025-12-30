// app/components/NotificationBell.client.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";

type Notification = {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "booking" | "reminder" | "update" | "promo";
};

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
  const router = useRouter();

  

  const unreadCount = notifications.filter((n) => !n.read).length;

  // 🔴 DUMMY: Real-time updates simulation
  // ✅ TODO: Replace with actual SSE when backend is ready
  useEffect(() => {
    // 🔴 REMOVE THIS BLOCK when using real API
    const simulateNewNotification = setInterval(() => {
      // Randomly add notification every 30 seconds (for demo)
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
    // 🔴 END OF DUMMY BLOCK

    /* ✅ UNCOMMENT THIS when backend is ready:
    
    const eventSource = new EventSource("/api/notifications/stream");

    eventSource.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      setNotifications((prev) => [newNotification, ...prev]);
    };

    eventSource.onerror = () => {
      eventSource.close();
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    };

    return () => {
      eventSource.close();
    };
    */
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
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

    // ✅ TODO: Uncomment when API is ready
    /*
    try {
      await fetch("/api/notifications/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch (error) {
      console.error("Failed to mark as read:", error);
      // Rollback on error
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: false } : n))
      );
    }
    */
  };

  const markAllAsRead = async () => {
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    // ✅ TODO: Uncomment when API is ready
    /*
    try {
      await fetch("/api/notifications/mark-all-read", {
        method: "POST",
      });
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
    */
  };

  const deleteNotification = async (id: string) => {
    // Optimistic update
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    // ✅ TODO: Uncomment when API is ready
    /*
    try {
      await fetch("/api/notifications/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
    */
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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:text-orange-600 dark:text-white dark:hover:text-orange-500 rounded-lg transition-all"
        aria-label="Notifications"
      >
        <Bell size={18} className="sm:w-5 sm:h-5" />

        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {isOpen && (
        <div className="fixed lg:absolute top-0 right-0 lg:top-auto lg:right-0 lg:mt-3 w-full h-full lg:h-auto lg:w-72 rounded-2xl backdrop-blur-md bg-white/80 dark:bg-slate-900/80 shadow-2xl border border-white/20 dark:border-gray-700/50 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
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

          <div className="h-[calc(100vh-140px)] lg:max-h-[350px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-6 sm:p-8 text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-2 sm:mb-3 rounded-full bg-gray-100/80 dark:bg-gray-800/50 backdrop-blur-sm flex items-center justify-center">
                  <Bell
                    size={20}
                    className="sm:w-6 sm:h-6 text-gray-300 dark:text-gray-600"
                  />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  No notifications
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-500">
                  We'll notify you when something arrives
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-2.5 sm:p-3 hover:bg-orange-500/10 dark:hover:bg-orange-500/20 transition-colors cursor-pointer backdrop-blur-sm ${
                      !notification.read
                        ? "bg-orange-50/40 dark:bg-orange-500/10"
                        : "bg-transparent"
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-2">
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getTypeStyles(
                          notification.type
                        )}`}
                      >
                        <Bell size={12} className="sm:w-3 sm:h-3" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-[11px] sm:text-xs font-semibold text-gray-900 dark:text-white truncate">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0 mt-1 animate-pulse" />
                          )}
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-gray-600 dark:text-gray-300 mt-0.5 line-clamp-2 leading-relaxed">
                          {notification.message}
                        </p>
                        <p className="text-[9px] sm:text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                          {notification.timestamp}
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="p-1 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-lg transition flex-shrink-0"
                        aria-label="Delete notification"
                      >
                        <Trash2 size={12} className="sm:w-3 sm:h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

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

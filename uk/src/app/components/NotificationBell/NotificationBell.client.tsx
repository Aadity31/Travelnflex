"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Trash2 } from "lucide-react";

/* -----------------------------
   DB Type
------------------------------ */
interface DBNotification {
  id: number;
  title: string;
  message: string;
  type: "booking" | "reminder" | "update" | "promo";
  is_read: boolean;
  created_at: string;
  link: string | null;
}

/* -----------------------------
   UI Type
------------------------------ */
interface UINotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: DBNotification["type"];
  link: string | null;
}

/* -----------------------------
   Mapper
------------------------------ */
function mapFromDB(n: DBNotification): UINotification {
  return {
    id: String(n.id),
    title: n.title,
    message: n.message,
    read: n.is_read,
    type: n.type,
    link: n.link,
    timestamp: new Date(n.created_at).toLocaleString(),
  };
}

export default function NotificationBellClient() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<UINotification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  /* -----------------------------
     Fetch from API
  ------------------------------ */
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/notifications", {
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) return;

        const data: DBNotification[] = await res.json();

        setNotifications(data.map(mapFromDB));
      } catch (err) {
        console.error("Notification fetch failed", err);
      }
    }

    load();
  }, []);

  /* -----------------------------
     Outside click
  ------------------------------ */
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handler);
    }

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [isOpen]);

  /* -----------------------------
     UI Actions
  ------------------------------ */
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((n) => n.id !== id)
    );
  };

  /* -----------------------------
     Badge Styles
  ------------------------------ */
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
      {/* Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1.5 sm:p-2 text-white hover:text-orange-600 dark:text-white dark:hover:text-orange-500 rounded-lg transition-all"
        aria-label="Notifications"
      >
        <Bell size={20} className="sm:w-[20px] sm:h-[20px]" />

        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-[8px] sm:text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-md max-h-[60vh]
          sm:absolute sm:top-full sm:right-0 sm:left-auto sm:translate-x-0 sm:w-[350px] sm:max-h-[400px]
          pb-2 sm:pb-3 mt-0 sm:mt-5 rounded-2xl backdrop-blur-md bg-white/90 dark:bg-slate-900/90
          shadow-2xl border border-white/20 dark:border-gray-700/50 z-50 flex flex-col overflow-hidden"
        >

          {/* Header */}
          <div className="px-3 py-3 sm:px-4 sm:py-4 bg-gradient-to-br from-orange-500/10 to-red-600/10 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between">

              <h3 className="text-xs sm:text-sm xl:text-base font-bold text-gray-900 dark:text-white">
                Notifications
              </h3>

              {unreadCount > 0 ? (
                <button
                  onClick={markAllAsRead}
                  className="text-[9px] sm:text-[10px] xl:text-xs text-orange-600 dark:text-orange-500 font-semibold px-2 py-1 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition"
                >
                  Mark all as read
                </button>
              ) : (
                <span className="text-[9px] sm:text-[10px] xl:text-xs text-gray-500 dark:text-gray-400">
                  You&apos;re all caught up!
                </span>
              )}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">

            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">
                No notifications
              </div>
            ) : (
              <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50">

                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2 sm:p-2.5 xl:p-3 hover:bg-orange-500/10 dark:hover:bg-orange-500/20 transition cursor-pointer ${
                      !n.read
                        ? "bg-orange-50/40 dark:bg-orange-500/10"
                        : ""
                    }`}
                    onClick={() => {
                      markAsRead(n.id);

                      if (n.link) {
                        window.location.href = n.link;
                      }
                    }}
                  >
                    <div className="flex items-start gap-2">

                      {/* Badge */}
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${getTypeStyles(
                          n.type
                        )}`}
                      >
                        <Bell size={12} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">

                        <div className="flex justify-between gap-2">
                          <h4 className="text-xs font-semibold truncate text-gray-900 dark:text-white">
                            {n.title}
                          </h4>

                          {!n.read && (
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1 animate-pulse" />
                          )}
                        </div>

                        <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-0.5 line-clamp-2">
                          {n.message}
                        </p>

                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {n.timestamp}
                        </p>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(n.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={12} />
                      </button>

                    </div>
                  </div>
                ))}

              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

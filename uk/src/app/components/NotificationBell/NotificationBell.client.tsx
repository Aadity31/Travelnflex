"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Trash2 } from "lucide-react";
import type { Notification } from "@/types/notification";

interface NotificationBellProps {
  initialNotifications: any[]; // raw from API
}

/* ----------------------------------
   Map DB → UI format
----------------------------------- */
function mapFromDB(n: any): Notification {
  return {
    id: String(n.id),
    title: n.title,
    message: n.message,
    read: n.is_read,
    type: n.type,
    timestamp: new Date(n.created_at).toLocaleString(),
  };
}

export default function NotificationBellClient({
  initialNotifications,
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>(
    initialNotifications.map(mapFromDB)
  );

  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  /* ----------------------------------
     Close on outside click
  ----------------------------------- */
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

  /* ----------------------------------
     Mark single read (UI only for now)
  ----------------------------------- */
  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  /* ----------------------------------
     Mark all read (UI only)
  ----------------------------------- */
  const markAllAsRead = async () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );
  };

  /* ----------------------------------
     Delete (UI only)
  ----------------------------------- */
  const deleteNotification = async (id: string) => {
    setNotifications((prev) =>
      prev.filter((n) => n.id !== id)
    );
  };

  /* ----------------------------------
     Badge styles
  ----------------------------------- */
  const getTypeStyles = (type: string) => {
    switch (type) {
      case "booking":
        return "bg-green-100/80 text-green-600 dark:bg-green-500/20 dark:text-green-400";
      case "reminder":
        return "bg-blue-100/80 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400";
      case "update":
        return "bg-orange-100/80 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400";
      case "promo":
        return "bg-purple-100/80 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400";
      default:
        return "bg-gray-100/80 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:text-orange-600 rounded-lg transition"
        aria-label="Notifications"
      >
        <Bell size={20} />

        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-4 w-[350px] max-h-[400px] rounded-2xl bg-white/90 dark:bg-slate-900/90 shadow-2xl border z-50 flex flex-col overflow-hidden">

          {/* Header */}
          <div className="px-4 py-3 border-b bg-orange-500/5">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold">Notifications</h3>

              {unreadCount > 0 ? (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-orange-600 font-semibold"
                >
                  Mark all as read
                </button>
              ) : (
                <span className="text-xs text-gray-500">
                  All caught up
                </span>
              )}
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto">

            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">
                No notifications
              </div>
            ) : (
              <div className="divide-y">

                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markAsRead(n.id)}
                    className={`p-3 cursor-pointer hover:bg-orange-500/10 ${
                      !n.read
                        ? "bg-orange-50/40"
                        : ""
                    }`}
                  >
                    <div className="flex gap-2">

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

                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-semibold truncate">
                            {n.title}
                          </h4>

                          {!n.read && (
                            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1 animate-pulse" />
                          )}
                        </div>

                        <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-2">
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

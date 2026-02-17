"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
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
     API Calls
  ------------------------------ */
  const apiMarkRead = async (id: string) => {
    await fetch("/api/notifications/mark-read", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  };

  const apiMarkAllRead = async () => {
    await fetch("/api/notifications/mark-all-read", {
      method: "POST",
    });
  };

  const apiDelete = async (id: string) => {
    await fetch("/api/notifications/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
  };

  /* -----------------------------
     UI + DB Actions
  ------------------------------ */
  const _markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    await apiMarkRead(id);
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await apiMarkAllRead();
  };

  const deleteNotification = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await apiDelete(id);
  };

  const handleNotificationClick = async (n: UINotification) => {
    try {
      if (!n.read) {
        await fetch("/api/notifications/mark-read", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: n.id }),
        });
      }

      setNotifications((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, read: true } : x))
      );

      setIsOpen(false);

      if (n.link) {
        router.push(n.link);
      }
    } catch (err) {
      console.error("Notification click failed:", err);
    }
  };

  /* -----------------------------
     Type-based Colors (Reusable System)
  ------------------------------ */
  const getTypeColors = (type: string) => {
    switch (type) {
      case "booking":
        return {
          bg: "bg-(--color-success-lighter)]",
          text: "text-(--color-success-dark)]",
          icon: "text-(--color-success)]",
        };
      case "reminder":
        return {
          bg: "bg-(--color-secondary-lighter)]",
          text: "text-(--color-secondary-dark)]",
          icon: "text-(--color-secondary)]",
        };
      case "update":
        return {
          bg: "bg-(--color-primary-lighter)]",
          text: "text-(--color-primary-dark)]",
          icon: "text-primary",
        };
      case "promo":
        return {
          bg: "bg-(--color-accent-lighter)]",
          text: "text-(--color-accent-dark)]",
          icon: "text-(--color-accent)]",
        };
      default:
        return {
          bg: "bg-(--background-tertiary)",
          text: "text-(--color-neutral-dark)",
          icon: "text-(--color-neutral)",
        };
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1.5 sm:p-2 text-white hover:text-primary rounded-(--radius-lg)] transition-(--transition-fast)] "
        aria-label="Notifications"
      >
        <Bell size={20} className="sm:w-5 sm:h-5" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-(--color-error)] text-white text-[8px] sm:text-[10px] font-bold rounded-(--radius-full)] flex items-center justify-center shadow-(--shadow-md)]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div 
          className="fixed top-16 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-md max-h-[60vh]
  sm:absolute sm:top-full sm:right-0 sm:left-auto sm:translate-x-0 sm:w-95 sm:max-h-112.5
  mt-0 sm:mt-3 pb-2 sm:pb-3 
  rounded-(--radius-2xl)] 
  bg-(--background)/95 backdrop-blur-lg
  shadow-(--shadow-xl)] 
  border border-(--border-light)]/50
  z-50 flex flex-col overflow-hidden
  [-webkit-backdrop-filter:blur(16px)]"

        >
          {/* Header */}
          <div className="px-4 py-3 sm:px-5 sm:py-4 bg-linear-to-r from-primary/5 to-primary-light/30 border-b border-(--border-light)]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-bold text-(--foreground)]">
                Notifications
              </h3>

              {unreadCount > 0 ? (
                <button
                  onClick={markAllAsRead}
                  className="text-[10px] sm:text-xs text-primary-dark font-semibold px-2.5 py-1.5 hover:bg-primary-light/50 rounded-md transition-(--transition-fast)"
                >
                  Mark all read
                </button>
              ) : (
                <span className="text-[10px] sm:text-xs text-(--foreground-secondary)] font-medium">
                  All caught up! ✨
                </span>
              )}
            </div>
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Bell size={40} className="text-(--foreground-muted)] mb-3 opacity-80" />
                <p className="text-sm text-(--foreground-secondary)] font-medium">
                  No notifications yet
                </p>
                <p className="text-xs text-(--foreground-muted)] mt-1">
                  {`We'll notify you when something arrives`}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-(--border-light)">
                {notifications.map((n) => {
                  const colors = getTypeColors(n.type);
                  
                  return (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-3 sm:p-4 cursor-pointer transition-(--transition-fast) hover:bg-(--background-hover) ${
                        !n.read ? "bg-(--color-primary-lightest)" : "bg-(--background)"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Badge Icon */}
                        <div
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0 ${colors.bg}`}
                        >
                          <Bell size={14} className={colors.icon} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className={`text-xs sm:text-sm font-semibold line-clamp-1 ${colors.text}`}>
                              {n.title}
                            </h4>

                            {!n.read && (
                              <span className="w-2 h-2 bg-primary rounded-(--radius-full)] shrink-0 mt-1 animate-pulse" />
                            )}
                          </div>

                          <p className="text-[11px] sm:text-xs text-(--foreground-secondary)] line-clamp-2 leading-relaxed mb-1.5">
                            {n.message}
                          </p>

                          <p className="text-[10px] text-(--foreground-muted)] font-medium">
                            {n.timestamp}
                          </p>
                        </div>

                        {/* Delete Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(n.id);
                          }}
                          className="p-1.5 text-(--foreground-muted)] hover:text-error hover:bg-(--color-error-lighter) rounded-md transition-(--transition-fast) shrink-0"
                          aria-label="Delete notification"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import NotificationBellClient from "../NotificationBell/NotificationBell.client";

export default function NotificationBellWrapper() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/notifications", {
          credentials: "include",
        });

        if (!res.ok) return;

        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error("Notif fetch failed", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return null;

  return <NotificationBellClient notifications={data} />;
}

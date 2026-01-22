"use client";

import { useEffect, useState } from "react";
import NotificationBellClient from "../NotificationBell/NotificationBell.client";

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

export default function NotificationBellWrapper() {
  const [data, setData] = useState<DBNotification[]>([]);
  const [status, setStatus] = useState<"init" | "done" | "error">("init");

  useEffect(() => {
    async function load() {
      console.log("FETCHING NOTIFS...");

      try {
        const res = await fetch("/api/notifications", {
          credentials: "include",
          cache: "no-store",
        });

        console.log("STATUS:", res.status);

        const json: DBNotification[] = await res.json();

        console.log("DATA:", json);

        setData(json);
        setStatus("done");
      } catch (e) {
        console.error("FETCH ERROR", e);
        setStatus("error");
      }
    }

    load();
  }, []);

  return (
    <>
      {/* Debug */}
      <div className="hidden">
        DEBUG: {status} / {data.length}
      </div>

      <NotificationBellClient notifications={data} />
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import NotificationBellClient from "./NotificationBell.client";

/* -----------------------------
   DB Notification Type
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

type Status = "init" | "done" | "error";

/* -----------------------------
   DB Notification Type
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

type Status = "init" | "done" | "error";

export default function NotificationBellWrapper() {
  const [data, setData] = useState<DBNotification[]>([]);
  const [status, setStatus] = useState<Status>("init");

  useEffect(() => {
    async function load(): Promise<void> {
      console.log("FETCHING NOTIFS...");

      try {
        const res = await fetch("/api/notifications", {
          credentials: "include",
          cache: "no-store",
        });

        console.log("STATUS:", res.status);

        const json = (await res.json()) as DBNotification[];

        console.log("DATA:", json);

        setData(json);
        setStatus("done");
      } catch (err) {
        console.error("FETCH ERROR", err);
        setStatus("error");
      }
    }

    load();
  }, []);

  return (
    <>
      {/* Debug (hidden) */}
      <div className="hidden">
        DEBUG: {status} / {data.length}
      </div>

      <NotificationBellClient notifications={data} />
    </>
  );
}

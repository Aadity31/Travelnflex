"use client";

import { useEffect, useState } from "react";
import NotificationBellClient from "../NotificationBell/NotificationBell.client";

export default function NotificationBellWrapper() {
  const [data, setData] = useState<any[]>([]);
  const [status, setStatus] = useState("init");

  useEffect(() => {
    async function load() {
      console.log("FETCHING NOTIFS...");

      try {
        const res = await fetch("/api/notifications", {
          credentials: "include",
        });

        console.log("STATUS:", res.status);

        const json = await res.json();

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
      <div className="hidden">
        DEBUG: {status} / {data.length}
      </div>

      <NotificationBellClient notifications={data} />
    </>
  );
}

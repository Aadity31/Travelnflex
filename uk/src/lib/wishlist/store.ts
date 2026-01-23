"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";

type WishlistMap = Record<string, boolean>;

export function useWishlistStore() {
  const { status } = useSession(); // 🔹 Modern session source

  const [map, setMap] = useState<WishlistMap>({});
  const [showLogin, setShowLogin] = useState(false);

  /* ---------------- HELPERS ---------------- */

  const get = useCallback(
    (id: string) => {
      return Boolean(map[id]);
    },
    [map]
  );

  /* ---------------- BULK FETCH ---------------- */
  const fetchBulk = useCallback(async (ids: string[]) => {
    if (!ids.length) return;
  const missing = ids.filter((id) => map[id] === undefined);
if (!missing.length) return;

    try {
      const res = await fetch(
        `/api/wishlist/bulk?items=${encodeURIComponent(missing.join(","))}`,
        {
          credentials: "same-origin",
        }
      );

      if (!res.ok) return;

      const data: WishlistMap = await res.json();

      setMap((prev) => ({
        ...prev,
        ...data,
      }));
    } catch {
      // silent fail (non-blocking UX)
    }
  }, []);

  /* ---------------- TOGGLE ---------------- */
  const toggle = useCallback(
    async (id: string) => {
      // 🔹 FAST UX GATE (no API call if not logged in)
      if (status !== "authenticated") {
        setShowLogin(true);
        return;
      }

      // 🔹 Optimistic UI update
      setMap((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));

      try {
        const res = await fetch("/api/wishlist/toggle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ itemId: id }),
        });

        if (!res.ok) {
          throw new Error("Toggle failed");
        }

        const data = await res.json();

        // 🔹 Sync with server truth
        if (typeof data.liked === "boolean") {
          setMap((prev) => ({
            ...prev,
            [id]: data.liked,
          }));
        }
      } catch {
        // 🔹 Rollback optimistic update on failure
        setMap((prev) => ({
          ...prev,
          [id]: !prev[id],
        }));
      }
    },
    [status]
  );

  return {
    get,
    fetchBulk,
    toggle,
    map,
    showLogin,
    closeLogin: () => setShowLogin(false),
  };
}

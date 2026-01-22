"use client";

import { useEffect, useState } from "react";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

interface WishlistButtonProps {
  itemId: string;
  size?: "sm" | "md";
}

export default function WishlistButton({
  itemId,
  size = "md",
}: WishlistButtonProps) {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 On load → check wishlist status
  useEffect(() => {
    let ignore = false;

    async function checkStatus() {
      try {
        const res = await fetch(
          `/api/wishlist/status?itemId=${encodeURIComponent(itemId)}`
        );
        const data = await res.json();
        if (!ignore) setLiked(Boolean(data.liked));
      } catch {
        // silent fail
      }
    }

    checkStatus();
    return () => {
      ignore = true;
    };
  }, [itemId]);

  // 🔹 Toggle wishlist
  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const res = await fetch("/api/wishlist/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
      });

      const data = await res.json();
      if (res.ok && typeof data.liked === "boolean") {
        setLiked(data.liked);
      }
    } finally {
      setLoading(false);
    }
  };

  const iconSize =
    size === "sm"
      ? "w-4 h-4 sm:w-5 sm:h-5"
      : "w-5 h-5 sm:w-6 sm:h-6";

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 hover:bg-white transition-colors duration-200 disabled:opacity-60"
      aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
    >
      {liked ? (
        <HeartSolid className={`${iconSize} text-red-500`} />
      ) : (
        <HeartOutline
          className={`${iconSize} text-gray-600 hover:text-red-500`}
        />
      )}
    </button>
  );
}

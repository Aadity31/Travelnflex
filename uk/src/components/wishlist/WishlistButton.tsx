"use client";

import { useState, useTransition } from "react";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

interface WishlistButtonProps {
  liked: boolean;
  onToggle: () => Promise<void>;
  size?: "sm" | "md";
}

export default function WishlistButton({
  liked,
  onToggle,
  size = "md",
}: WishlistButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [localLiked, setLocalLiked] = useState(liked);

  const iconSize =
    size === "sm"
      ? "w-4 h-4 sm:w-5 sm:h-5"
      : "w-5 h-5 sm:w-6 sm:h-6";

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    if (isPending) return;

    // Optimistic UI
    const prev = localLiked;
    setLocalLiked(!prev);

    startTransition(async () => {
      try {
        await onToggle();
      } catch {
        // rollback on failure
        setLocalLiked(prev);
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 
      transition-colors duration-200
      ${isPending ? "opacity-60 cursor-not-allowed" : "hover:bg-white"}`}
      aria-label={localLiked ? "Remove from wishlist" : "Add to wishlist"}
    >
      {localLiked ? (
        <HeartSolid className={`${iconSize} text-red-500`} />
      ) : (
        <HeartOutline
          className={`${iconSize} text-gray-600 hover:text-red-500`}
        />
      )}
    </button>
  );
}

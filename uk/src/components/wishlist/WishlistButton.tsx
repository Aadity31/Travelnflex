"use client";

import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

interface WishlistButtonProps {
  liked: boolean;
  onToggle: () => void;
  size?: "sm" | "md";
}

export default function WishlistButton({
  liked,
  onToggle,
  size = "md",
}: WishlistButtonProps) {
  const iconSize =
    size === "sm"
      ? "w-4 h-4 sm:w-5 sm:h-5"
      : "w-5 h-5 sm:w-6 sm:h-6";

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        onToggle();
      }}
      className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 hover:bg-white transition-colors duration-200"
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

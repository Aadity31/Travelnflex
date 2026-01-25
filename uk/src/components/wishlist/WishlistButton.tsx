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
    size === "sm" ? "w-4 h-4 sm:w-5 sm:h-5" : "w-5 h-5 sm:w-6 sm:h-6";

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        onToggle();
      }}
      className={`
        group relative
        rounded-full p-1 sm:p-1.5
        transition-all duration-300 ease-out
        ${
          liked
            ? ""
            : "bg-black/25 backdrop-blur-md hover:bg-black/35  shadow-lg hover:shadow-xl"
        }
      `}
      aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
    >
      {/* Adaptive glow effect */}
      <div
        className={`
          absolute inset-0 rounded-full opacity-0 
          group-hover:opacity-100 transition-opacity duration-500
          ${liked ? "bg-red-400/50 blur-lg" : "bg-orange-400/30 blur-lg"}
        `}
      />

      {/* Heart icon */}
      <div className="relative z-10">
        {liked ? (
          <HeartSolid
            className={`
              ${iconSize} text-red-500
              animate-heartBeat
              group-hover:scale-110
              transition-transform duration-300 ease-out
              drop-shadow-[0_2px_8px_rgba(239,68,68,0.6)]
            `}
          />
        ) : (
          <HeartOutline
            className={`
              ${iconSize} text-white
              group-hover:text-orange-400
              group-hover:scale-110
              transition-all duration-300 ease-out
              drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]
              stroke-[2.5]
            `}
          />
        )}
      </div>
    </button>
  );
}

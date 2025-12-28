"use client";

import { getInitials } from "@/lib/getInitials";

type Props = {
  name: string;
  image?: string | null;
  size?: number;              // px
  className?: string;         // extra styles
  textSize?: string;          // tailwind text size
};

export default function UserAvatar({
  name,
  image,
  size = 36,
  textSize = "text-sm",
  className = "",
}: Props) {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        width={size}
        height={size}
        className={`rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-full bg-gradient-to-br from-orange-500 to-red-600 
        flex items-center justify-center text-white font-bold 
        ${textSize} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}

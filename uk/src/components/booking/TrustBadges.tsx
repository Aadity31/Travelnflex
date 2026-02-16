// TrustBadges.tsx - Reusable Component

import { Shield, CreditCard, Star, Headphones } from "lucide-react";

interface TrustBadge {
  icon: React.ReactNode;
  title: string;
  description: string;
  bgColor: string;
  borderColor: string;
  iconColor: string;
  textColor: string;
  descColor: string;
}

const trustBadges: TrustBadge[] = [
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Free Cancellation",
    description: "Up to 24 hours before",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    iconColor: "text-green-600",
    textColor: "text-green-800",
    descColor: "text-green-600",
  },
  {
    icon: <CreditCard className="w-5 h-5" />,
    title: "Secure Booking",
    description: "Your data is safe",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    iconColor: "text-blue-600",
    textColor: "text-blue-800",
    descColor: "text-blue-600",
  },
  {
    icon: <Star className="w-5 h-5" />,
    title: "Best Price",
    description: "Lowest rates Avilable",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    iconColor: "text-purple-600",
    textColor: "text-purple-800",
    descColor: "text-purple-600",
  },
  {
    icon: <Headphones className="w-5 h-5" />,
    title: "24/7 Support",
    description: "Round-the-clock help",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    iconColor: "text-orange-600",
    textColor: "text-orange-800",
    descColor: "text-orange-600",
  },
];

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 gap-3 pt-2">
      {trustBadges.map((badge, index) => (
        <div
          key={index}
          className={`flex items-center gap-3 p-3 ${badge.bgColor} border ${badge.borderColor} rounded-xl hover:shadow-md transition-all cursor-pointer`}
        >
          <div className={`flex-shrink-0 w-5 h-5 ${badge.bgColor.replace('50', '100')} rounded-full flex items-center justify-center`}>
            <span className={badge.iconColor}>{badge.icon}</span>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className={`font-semibold ${badge.textColor} text-sm leading-tight`}>
              {badge.title}
            </span>
            <span className={`text-[0.650rem] ${badge.descColor} leading-tight mt-0.5 truncate`}>
              {badge.description}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

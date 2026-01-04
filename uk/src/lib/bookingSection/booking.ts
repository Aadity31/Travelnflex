// lib/booking.ts

export type PackageType = "solo" | "family" | "private" | "group";

export interface BookingState {
  packageType: PackageType;
  adults: number;
  children: number;
  rooms: number;
  selectedDate: string | null;
  availableSlots: number;
}

export interface RoomLimits {
  min: number;
  max: number;
}

export interface PricingResult {
  pricePerPerson: number;
  peopleTotal: number;
  roomCost: number;
  subtotal: number;
  discount: number;
  total: number;
}

export const PACKAGE_CONFIG = {
  solo: {
    label: "Solo Traveler",
    description: "Join existing group",
    minAdults: 1,
    maxAdults: 1,
    allowChildren: false,
    discount: 0,
  },
  family: {
    label: "Family Package",
    description: "2-8 people with children",
    minAdults: 1,
    maxAdults: 8,
    allowChildren: true,
    discount: 0.1,
  },
  private: {
    label: "Private Group",
    description: "8-20 adults only",
    minAdults: 8,
    maxAdults: 20,
    allowChildren: false,
    discount: 0.15,
  },
  group: {
    label: "Join Group",
    description: "Your group + others",
    minAdults: 1,
    maxAdults: 50,
    allowChildren: true,
    discount: 0.2,
  },
} as const;

export function getRoomLimits(
  adults: number,
  children: number,
  packageType: PackageType
): RoomLimits {
  if (packageType === "solo") return { min: 1, max: 1 };

  if (packageType === "group") {
    const totalPeople = adults + children;
    return { min: 1, max: Math.ceil(totalPeople / 2) };
  }

  if (packageType === "family") {
    const totalPeople = adults + children;

    if (totalPeople === 2) return { min: 1, max: 2 };
    if (totalPeople === 3) return { min: 1, max: 3 };
    if (totalPeople === 4) {
      if (children > 0) return { min: 1, max: 4 };
      return { min: 2, max: 4 };
    }
    if (totalPeople === 5) return { min: 3, max: 5 };
    if (totalPeople === 6) return { min: 3, max: 6 };
    if (totalPeople === 7) return { min: 4, max: 7 };
    if (totalPeople === 8) return { min: 4, max: 8 };

    return { min: 1, max: totalPeople };
  }

  if (packageType === "private") {
    const minRooms = Math.ceil(adults / 2);
    const maxRooms = adults;
    return { min: minRooms, max: maxRooms };
  }

  return { min: 1, max: 1 };
}

export function calculatePricing(
  booking: BookingState,
  basePrice: number
): PricingResult {
  const discountRate = PACKAGE_CONFIG[booking.packageType].discount;
  const pricePerPersonRaw = basePrice * (1 - discountRate);

  const totalPeople = booking.adults + booking.children * 0.5;
  const peopleTotal = Math.round(pricePerPersonRaw * totalPeople);
  const roomCost = booking.rooms * 500;
  const subtotal = peopleTotal + roomCost;
  const discount = (basePrice - pricePerPersonRaw) * booking.adults;

  return {
    pricePerPerson: Math.round(pricePerPersonRaw),
    peopleTotal,
    roomCost,
    subtotal: Math.round(subtotal),
    discount: Math.round(discount),
    total: Math.round(subtotal),
  };
}

export function getAvailableDates(): Record<string, number> {
  const dates: Record<string, number> = {};
  const today = new Date();

  for (let i = 1; i <= 60; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];

    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      dates[dateStr] = Math.floor(Math.random() * 50) + 10;
    }
  }

  return dates;
}

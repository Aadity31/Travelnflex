import BookingConfirmForm from "@/app/booking/[type]/[slug]/confirm/Confirm.client";

export default function TestUI() {
  const dummyData = {
    name: "Char Dham Yatra",
    image: "/images/placeholder.jpg",
    location: "Uttarakhand, India",
    selectedDate: "2026-01-15",
    adults: 2,
    children: 0,
    rooms: 1,
    packageType: "deluxe",
    pricing: {
      peopleTotal: 30000,
      roomCost: 8000,
      discount: 0,
      total: 42000,
    },
  };

  return <BookingConfirmForm bookingData={dummyData} />;
}

import Image from "next/image";

const ADDONS = [
  {
    name: "Helicopter Shuttle",
    tag: "Most Popular",
    desc: "Skip the 18 km trek and reach Kedarnath in minutes with priority boarding.",
    price: "4,500",
    unit: "per person",
    image: "/images/heli.jpg",
    badgeColor: "bg-emerald-100 text-emerald-700",
  },
  {
    name: "Special Temple Puja",
    tag: "Recommended",
    desc: "Personalized puja at Badrinath with dedicated priest and front-row darshan.",
    price: "2,100",
    unit: "per family",
    image: "/images/puja.jpg",
    badgeColor: "bg-orange-100 text-orange-700",
  },
  {
    name: "VIP Ganga Aarti Seating",
    tag: "Limited Slots",
    desc: "Reserved front-row seating at Haridwar/Rishikesh evening Ganga Aarti.",
    price: "1,200",
    unit: "per person",
    image: "/images/aarti.jpg",
    badgeColor: "bg-indigo-100 text-indigo-700",
  },
  {
    name: "Extra Luggage Support",
    tag: "Comfort",
    desc: "Porter service for your bags during treks and temple visits.",
    price: "800",
    unit: "per day",
    image: "/images/porter.jpg",
    badgeColor: "bg-sky-100 text-sky-700",
  },
];

export default function EnhanceTrip() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Enhance Your Trip
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Make your Char Dham yatra more comfortable with smart add-ons
          </p>
        </div>
        <button
          type="button"
          className="text-xs font-bold text-orange-500 hover:text-orange-600 hover:underline"
        >
          View all add-ons
        </button>
      </div>

      {/* Addons grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ADDONS.map((addon, idx) => (
          <button
            key={idx}
            type="button"
            className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group text-left"
          >
            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-200">
              <Image
                src={addon.image}
                alt={addon.name}
                width={64}
                height={64}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              {addon.tag && (
                <span className={`absolute bottom-1 left-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold shadow-sm ${addon.badgeColor}`}>
                  {addon.tag}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h5 className="text-sm font-bold text-gray-900 group-hover:text-orange-500 transition-colors">
                {addon.name}
              </h5>
              <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                {addon.desc}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900">
                    ₹{addon.price}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {addon.unit}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-orange-500 border border-orange-500 px-2 py-1 rounded-full group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  ADD
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Small note */}
      <p className="mt-3 text-[10px] text-gray-400">
        Add-ons are subject to availability and weather conditions in the Himalayas.
      </p>
    </div>
  );
}

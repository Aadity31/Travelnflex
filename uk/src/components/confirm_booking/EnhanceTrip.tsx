import Image from "next/image";

export default function EnhanceTrip() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">
          Enhance Your Trip
        </h3>
        <a
          href="#"
          className="text-xs font-bold text-orange-500 hover:underline"
        >
          View All
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            name: "Helicopter Service",
            desc: "Kedarnath shuttle service",
            price: "4,500",
            image: "/images/heli.jpg",
          },
          {
            name: "Special Puja",
            desc: "Personalized ritual at Badrinath",
            price: "2,100",
            image: "/images/puja.jpg",
          },
        ].map((addon, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:border-orange-300 transition-colors cursor-pointer group"
          >
            <div className="w-16 h-16 rounded overflow-hidden shrink-0 bg-gray-200">
              <Image
                src={addon.image}
                alt={addon.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h5 className="text-sm font-bold text-gray-900 group-hover:text-orange-500 transition-colors">
                {addon.name}
              </h5>
              <p className="text-xs text-gray-500 mb-2">{addon.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">
                  ₹{addon.price}
                </span>
                <button className="text-[10px] font-bold text-orange-500 border border-orange-500 px-2 py-0.5 rounded hover:bg-orange-500 hover:text-white transition-colors">
                  ADD
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

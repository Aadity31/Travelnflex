import Link from "next/link";
import {
  CheckCircleIcon,
  UserGroupIcon,
  MapIcon,
  StarIcon,
} from "@heroicons/react/24/solid";

export default function CTASectionSplit() {
  const stats = [
    { icon: UserGroupIcon, value: "5000+", label: "Happy Travelers" },
    { icon: MapIcon, value: "50+", label: "Sacred Sites" },
    { icon: StarIcon, value: "4.9", label: "Average Rating" },
  ];

  const benefits = [
    "Expert local guides",
    "Customized itineraries",
    "24/7 support",
    "Best price guarantee",
  ];

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Left Side - Content */}
            <div className="p-6 sm:p-8 md:p-10 lg:p-12 bg-gradient-to-br from-orange-600 to-red-600 text-white">
              <div className="inline-block bg-white/20 backdrop-blur-sm px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                ✨ Limited Time Offer
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
                Begin Your Sacred Journey
              </h2>
              <p className="text-sm sm:text-base text-white/90 mb-5 sm:mb-6 leading-relaxed">
                Experience spirituality like never before with our expertly
                curated tours and personalized guidance.
              </p>

              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 sm:gap-3">
                    <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="text-sm sm:text-base">{benefit}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className="inline-block w-full sm:w-auto text-center bg-white text-orange-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-xl text-sm sm:text-base"
              >
                Get Started Now
              </Link>
            </div>

            {/* Right Side - Stats & Form */}
            <div className="p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center bg-gray-50 md:bg-white">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                Why Choose Us?
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                      <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-gray-900">
                        {stat.value}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        {stat.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 sm:pt-6 border-t border-gray-200">
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                  Join thousands of travelers who found peace and purpose
                </p>
                <Link
                  href="/testimonials"
                  className="text-orange-600 font-semibold hover:text-red-600 transition-colors text-xs sm:text-sm flex items-center gap-2"
                >
                  Read Success Stories
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

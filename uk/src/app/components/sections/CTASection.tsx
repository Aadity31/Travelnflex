import Link from 'next/link';
import { CheckCircleIcon, UserGroupIcon, MapIcon, StarIcon } from '@heroicons/react/24/solid';

export default function CTASectionSplit() {
  const stats = [
    { icon: UserGroupIcon, value: '5000+', label: 'Happy Travelers' },
    { icon: MapIcon, value: '50+', label: 'Sacred Sites' },
    { icon: StarIcon, value: '4.9', label: 'Average Rating' }
  ];

  const benefits = [
    'Expert local guides',
    'Customized itineraries',
    '24/7 support',
    'Best price guarantee'
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left Side - Content */}
            <div className="p-8 md:p-12 bg-gradient-to-br from-orange-600 to-red-600 text-white">
              <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium mb-6">
                ✨ Limited Time Offer
              </div>
              
              <h2 className="text-3xl font-bold mb-4">
                Begin Your Sacred Journey
              </h2>
              <p className="text-white/90 mb-6">
                Experience spirituality like never before with our expertly curated tours and personalized guidance.
              </p>

              <ul className="space-y-3 mb-8">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/contact"
                className="inline-block bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-xl"
              >
                Get Started Now
              </Link>
            </div>

            {/* Right Side - Stats & Form */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Why Choose Us?
              </h3>

              <div className="grid grid-cols-1 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-4">
                  Join thousands of travelers who found peace and purpose
                </p>
                <Link
                  href="/testimonials"
                  className="text-orange-600 font-semibold hover:text-red-600 transition-colors text-sm flex items-center gap-2"
                >
                  Read Success Stories
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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

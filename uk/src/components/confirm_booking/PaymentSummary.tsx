import { LockClosedIcon, PhoneIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { ShieldCheckIcon } from "@heroicons/react/24/solid";

interface BookingPricing {
  total: number;
}

interface BookingData {
  name: string;
  selectedDate: string | Date;
  adults: number;
  children: number;
  rooms: number;
  pricing: BookingPricing;
}

export default function PaymentSummary({
  bookingData,
  basePrice,
  gst,
  serviceFee,
}: {
  bookingData: BookingData;
  basePrice: number;
  gst: number;
  serviceFee: number;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden sticky top-6">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Payment Summary
            </h2>
            <p className="text-green-50 text-sm flex items-center gap-1">
              <ShieldCheckIcon className="w-4 h-4" />
              Secure & encrypted
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* Booking Details */}
        <div className="mb-5 space-y-3">
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-3">
            <div className="text-xs font-bold text-orange-700 uppercase tracking-wide mb-1">
              Package Selected
            </div>
            <div className="font-bold text-gray-900 text-base">
              {bookingData.name}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Travel Dates</div>
              <div className="font-semibold text-gray-900 text-sm">
                {new Date(bookingData.selectedDate).toLocaleDateString(
                  "en-IN",
                  { day: "numeric", month: "short" }
                )}
              </div>
              <div className="text-xs text-gray-500">10D/9N</div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Travelers</div>
              <div className="font-semibold text-gray-900 text-sm">
                {bookingData.adults} Adult{bookingData.adults > 1 ? "s" : ""}
              </div>
              {bookingData.children > 0 && (
                <div className="text-xs text-gray-500">
                  +{bookingData.children} Child{bookingData.children > 1 ? "ren" : ""}
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="text-xs text-gray-500 mb-1">Accommodation</div>
            <div className="font-semibold text-gray-900 text-sm">
              {bookingData.rooms} x Double Sharing Room{bookingData.rooms > 1 ? "s" : ""}
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-4 mb-5">
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Price Breakdown
          </h4>
          
          <div className="space-y-2.5 mb-3">
            {/* Adult Price */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Adult X {bookingData.adults}</span>
              <span className="text-sm font-semibold text-gray-900">
                ₹{basePrice.toLocaleString("en-IN")}
              </span>
            </div>
            
            {/* Child Price */}
            {bookingData.children > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Child X {bookingData.children}</span>
                <span className="text-sm font-semibold text-gray-900">
                  ₹{basePrice.toLocaleString("en-IN")}
                </span>
              </div>
            )}
            
            {/* Hotel Price */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Hotel X {bookingData.rooms}</span>
              <span className="text-sm font-semibold text-gray-900">
                ₹{basePrice.toLocaleString("en-IN")}
              </span>
            </div>
            
            {gst > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Taxes & GST (5%)</span>
                <span className="text-sm font-semibold text-gray-900">
                  ₹{gst.toLocaleString("en-IN")}
                </span>
              </div>
            )}
            {serviceFee > 0 && (
              <div className="flex justify-between items-center pb-3 border-b-2 border-dashed border-gray-300">
                <span className="text-sm text-gray-600">Service Fee</span>
                <span className="text-sm font-semibold text-gray-900">
                  ₹{serviceFee.toLocaleString("en-IN")}
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center bg-white rounded-lg p-3 border-2 border-green-200">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Total Amount</div>
              <div className="text-sm text-gray-600">All inclusive</div>
            </div>
            <div className="text-right">
              <div className="font-bold text-2xl text-green-600">
                ₹{bookingData.pricing.total.toLocaleString("en-IN")}
              </div>
            </div>
          </div>
        </div>

        {/* What's Included */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-5">
          <h5 className="text-xs font-bold text-blue-900 uppercase tracking-wide mb-2">
            What&apos;s Included
          </h5>
          <div className="space-y-1.5">
            {[
              "Accommodation (9 Nights)",
              "Daily Breakfast & Dinner",
              "All Transfers & Sightseeing",
              "Professional Tour Guide",
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-blue-800">
                <CheckCircleIcon className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Button */}
        <button className="w-full h-12 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-base font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center mb-4 gap-2 group">
          <LockClosedIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span>Proceed to Payment</span>
        </button>

        {/* Trust Badges */}
        <div className="text-center mb-5">
          <p className="text-xs text-gray-500 mb-2 flex items-center justify-center gap-1">
            <ShieldCheckIcon className="w-4 h-4 text-green-600" />
            Secured by Razorpay • 256-bit SSL Encryption
          </p>
          <div className="flex justify-center gap-3 items-center">
            <div className="flex items-center gap-1">
              <div className="w-8 h-5 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">VISA</span>
              </div>
              <div className="w-8 h-5 bg-gradient-to-r from-red-600 to-orange-500 rounded flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">MC</span>
              </div>
              <div className="w-8 h-5 bg-gradient-to-r from-indigo-600 to-blue-500 rounded flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">UPI</span>
              </div>
              <div className="w-8 h-5 bg-gray-700 rounded flex items-center justify-center">
                <span className="text-white text-[8px] font-bold">NB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="pt-5 border-t-2 border-dashed border-gray-200">
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
            <h4 className="text-xs font-bold text-orange-900 mb-3 uppercase tracking-wide flex items-center gap-2">
              <PhoneIcon className="w-4 h-4" />
              Need Assistance?
            </h4>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-md shrink-0">
                <PhoneIcon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-orange-700 mb-0.5">
                  24/7 Customer Support
                </p>
                <a 
                  href="tel:+919876543210"
                  className="text-base font-bold text-orange-900 hover:text-orange-700 transition-colors"
                >
                  +91 98765 43210
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { LockClosedIcon, PhoneIcon } from "@heroicons/react/24/outline";
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
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 sticky top-6">
      <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-4">
        <div className="w-10 h-10 rounded bg-green-100 text-green-600 flex items-center justify-center shrink-0">
          <svg
            className="w-6 h-6"
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
          <h2 className="text-lg font-bold text-gray-900">
            Payment Summary
          </h2>
          <p className="text-gray-500 text-xs">
            Complete payment to finalize
          </p>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Package</span>
          <span className="font-bold text-gray-900">
            {bookingData.name}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Dates</span>
          <span className="font-bold text-gray-900">
            {new Date(bookingData.selectedDate).toLocaleDateString(
              "en-IN",
              { day: "numeric", month: "short" }
            )}{" "}
            - 24 Jan 2026
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Travelers</span>
          <span className="font-bold text-gray-900">
            {bookingData.adults} Adult
            {bookingData.adults > 1 ? "s" : ""}
            {bookingData.children > 0 &&
              ` + ${bookingData.children} Child${
                bookingData.children > 1 ? "ren" : ""
              }`}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Room Type</span>
          <span className="font-bold text-gray-900">
            {bookingData.rooms} x Double Sharing
          </span>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500">Base Price</span>
          <span className="text-sm font-semibold text-gray-900">
            ₹{basePrice.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500">
            Taxes & GST (5%)
          </span>
          <span className="text-sm font-semibold text-gray-900">
            ₹{gst.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex justify-between items-center mb-3 pb-3 border-b border-dashed border-gray-300">
          <span className="text-xs text-gray-500">Service Fee</span>
          <span className="text-sm font-semibold text-gray-900">
            ₹{serviceFee.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-900">Total Amount</span>
          <span className="font-bold text-xl text-orange-500">
            ₹{bookingData.pricing.total.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      <button className="w-full h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold shadow-lg transition-all flex items-center justify-center mb-4 gap-2">
        <LockClosedIcon className="w-5 h-5" />
        <span>Pay Now & Confirm</span>
      </button>

      <div className="text-center">
        <p className="text-xs text-gray-400 mb-2">
          Secure payment powered by Razorpay
        </p>
        <div className="flex justify-center gap-2 opacity-60 grayscale">
          <div className="h-4 w-8 bg-gray-300 rounded"></div>
          <div className="h-4 w-8 bg-gray-300 rounded"></div>
          <div className="h-4 w-8 bg-gray-300 rounded"></div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-wide">
          Need Help?
        </h4>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-orange-500">
            <PhoneIcon className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500">
              Call our travel expert
            </p>
            <p className="text-sm font-bold text-gray-900">
              +91 98765 43210
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

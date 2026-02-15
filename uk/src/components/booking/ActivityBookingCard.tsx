"use client";

import { useState } from "react";
import {
  MapPinIcon,
  ClockIcon,
  SparklesIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  BoltIcon,
  ShoppingCartIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { StarIcon } from "@heroicons/react/24/solid";
import { useCartStore } from "@/lib/cart/store";
import ToastContainer from "@/components/toast/Toast";

interface ActivityBookingCardProps {
  data: {
    id: string;
    name: string;
    slug: string;
    location: string;
    duration?: string;
    bestTimeToVisit?: string;
    difficulty?: string;
    description?: string;
    rating: number;
    reviewCount: number;
    type?: string;
  };
  displayData: {
    description: string;
    highlights: string[];
    includes: string[];
  };
  currentPrice: number;
  effectiveDiscount: number;
}

export function ActivityBookingCard({
  data,
  displayData,
  currentPrice,
  effectiveDiscount,
}: ActivityBookingCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const cart = useCartStore();

  const discountedPrice = currentPrice * (1 - effectiveDiscount);
  const totalPrice = discountedPrice * quantity;

  // Check if item is already in cart
  const isInCart = cart.isInCart(data.id);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      const success = await cart.addToCartFromDetails(
        {
          id: data.id,
          name: data.name,
          slug: data.slug,
          location: data.location,
          price: Math.round(discountedPrice),
        },
        quantity
      );

      if (!success) {
        // Login prompt was shown
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleRemoveFromCart = async () => {
    setIsAddingToCart(true);
    try {
      await cart.removeFromCart(data.id);
    } catch (error) {
      console.error("Error removing from cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <>
      {/* Toast Notifications */}
      <ToastContainer
        toasts={cart.toasts}
        onHideToast={cart.hideToast}
      />

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-2xl font-bold text-gray-900">{data.name}</h2>
          {data.type && (
            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-semibold uppercase">
              {data.type}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="font-bold text-gray-900">{data.rating.toFixed(1)}</span>
          </div>
          <span className="text-gray-500 text-sm">
            ({data.reviewCount} reviews)
          </span>
        </div>

        {/* Quick Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-4 h-4 text-orange-500 flex-shrink-0" />
            <span className="font-medium text-gray-900">{data.location}</span>
          </div>

          {data.duration && (
            <div className="flex items-center gap-2">
              <ClockIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="text-gray-700">{data.duration}</span>
            </div>
          )}

          {data.bestTimeToVisit && (
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-purple-500 flex-shrink-0" />
              <span className="text-gray-700">Best: {data.bestTimeToVisit}</span>
            </div>
          )}

          {data.difficulty && (
            <div className="flex items-center gap-2">
              <span className="bg-orange-500 text-white px-3 py-1 rounded-md text-xs font-semibold capitalize">
                {data.difficulty}
              </span>
            </div>
          )}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap gap-2 mt-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-md">
            <ShieldCheckIcon className="w-4 h-4" />
            <span>Verified Operator</span>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-md">
            <BoltIcon className="w-4 h-4" />
            <span>Instant Confirmation</span>
          </div>
        </div>
      </div>

      {/* Description */}
      {displayData.description && (
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            About This Experience
          </h3>
          <p className="text-gray-700 leading-relaxed text-sm line-clamp-4">
            {displayData.description}
          </p>
        </div>
      )}

      {/* What's Included */}
      {displayData.includes && displayData.includes.length > 0 && (
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            What&apos;s Included
          </h3>
          <div className="space-y-2">
            {displayData.includes.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
            {displayData.includes.length > 5 && (
              <p className="text-sm text-gray-500 mt-2">
                +{displayData.includes.length - 5} more included
              </p>
            )}
          </div>
        </div>
      )}

      {/* Highlights */}
      {displayData.highlights && displayData.highlights.length > 0 && (
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Highlights</h3>
          <div className="space-y-2">
            {displayData.highlights.slice(0, 4).map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pricing & Add to Cart */}
      <div className="p-6 bg-gray-50">
        {/* Price Display */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2 mb-1">
            {effectiveDiscount > 0 && (
              <span className="text-lg text-gray-500 line-through">
                ₹{currentPrice.toLocaleString()}
              </span>
            )}
            <span className="text-3xl font-bold text-gray-900">
              ₹{Math.round(discountedPrice).toLocaleString()}
            </span>
            <span className="text-gray-600">/person</span>
          </div>
          {effectiveDiscount > 0 && (
            <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-semibold">
              <span>Save {(effectiveDiscount * 100).toFixed(0)}%</span>
            </div>
          )}
        </div>

        

        

        {/* Add to Cart / Remove from Cart Button */}
        <button
          onClick={isInCart ? handleRemoveFromCart : handleAddToCart}
          disabled={isAddingToCart}
          className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
            isInCart
              ? "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
              : "bg-orange-500 hover:bg-orange-600 text-white"
          }`}
        >
          <ShoppingCartIcon className="w-5 h-5" />
          <span>{isAddingToCart ? "Processing..." : isInCart ? "Remove from Cart" : "Add to Cart"}</span>
        </button>

        {/* Additional Info */}
        <p className="text-xs text-gray-500 text-center mt-3">
          Activities can be added only while you have add destinations in your cart. Please add a destination first to add this activity.
        </p>
      </div>
    </div>
    </>
  );
}

"use client";

import { useState } from "react";
import { ShoppingCartIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { useCartStore } from "@/lib/cart/store";
import ToastContainer from "@/components/toast/Toast";

interface ActivityMobileBarProps {
  currentPrice: number;
  effectiveDiscount: number;
  activityId: string;
  activitySlug: string;
  activityName: string;
  activityLocation?: string;
  activityImage?: string;
}

export function ActivityMobileBar({
  currentPrice,
  effectiveDiscount,
  activityId,
  activitySlug,
  activityName,
  activityLocation = "",
  activityImage,
}: ActivityMobileBarProps) {
  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const cart = useCartStore();

  const discountedPrice = Math.round(currentPrice * (1 - effectiveDiscount));
  const totalPrice = discountedPrice * quantity;

  // Check if item is already in cart
  const isInCart = cart.isInCart(activityId);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      const success = await cart.addToCartFromDetails(
        {
          id: activityId,
          name: activityName,
          slug: activitySlug,
          location: activityLocation,
          price: discountedPrice,
          image: activityImage,
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
      setIsExpanded(false);
    }
  };

  const handleRemoveFromCart = async () => {
    setIsAddingToCart(true);
    try {
      await cart.removeFromCart(activityId);
    } catch (error) {
      console.error("Error removing from cart:", error);
    } finally {
      setIsAddingToCart(false);
      setIsExpanded(false);
    }
  };

  return (
    <>
      {/* Toast Notifications */}
      <ToastContainer
        toasts={cart.toasts}
        onHideToast={cart.hideToast}
      />

      {/* Expanded quantity selector overlay */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
          onClick={() => setIsExpanded(false)}
          aria-hidden="true"
        />
      )}

      {/* Main sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-gray-200 shadow-2xl transition-all duration-300">
        {/* Expanded quantity selector */}
        {isExpanded && (
          <div className="border-b border-gray-200 p-4 animate-slide-up">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700">
                Number of People
              </span>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <ChevronUpIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-bold text-xl text-gray-700"
                aria-label="Decrease quantity"
              >
                −
              </button>
              
              <div className="w-20 text-center">
                <span className="text-3xl font-bold text-gray-900">{quantity}</span>
                <p className="text-xs text-gray-500 mt-1">
                  {quantity === 1 ? "person" : "people"}
                </p>
              </div>
              
              <button
                onClick={() => setQuantity(Math.min(20, quantity + 1))}
                disabled={quantity >= 20}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-bold text-xl text-white"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            {/* Total in expanded view */}
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Total</span>
              <span className="text-2xl font-bold text-gray-900">
                ₹{totalPrice.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* Collapsed main bar */}
        <div className="p-4">
          <div className="flex items-center justify-between gap-3">
            {/* Price section */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex-shrink-0 text-left"
              aria-label="Select quantity"
            >
              <div className="flex items-center gap-2 mb-1">
                {effectiveDiscount > 0 && (
                  <span className="text-sm text-gray-500 line-through">
                    ₹{currentPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-2xl font-bold text-gray-900">
                  ₹{discountedPrice.toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">per person</span>
                {effectiveDiscount > 0 && (
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                    {(effectiveDiscount * 100).toFixed(0)}% OFF
                  </span>
                )}
              </div>

              {/* Quantity indicator */}
              {quantity > 1 && (
                <div className="mt-1 text-xs text-orange-600 font-medium">
                  {quantity} {quantity === 1 ? "person" : "people"} • ₹{totalPrice.toLocaleString()} total
                </div>
              )}
            </button>

            {/* Add to cart / Remove from cart button */}
            <button
              onClick={isInCart ? handleRemoveFromCart : handleAddToCart}
              disabled={isAddingToCart}
              className={`flex-shrink-0 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg active:shadow-sm transform active:scale-95 whitespace-nowrap ${
                isInCart ? "bg-red-500 hover:bg-red-600" : ""
              }`}
              aria-label={isInCart ? "Remove from cart" : "Add to cart"}
            >
              <ShoppingCartIcon className="w-5 h-5" />
              <span>{isAddingToCart ? "Processing..." : isInCart ? "Remove" : "Add to Cart"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from being hidden behind sticky bar */}
      <div className="h-20" aria-hidden="true" />
    </>
  );
}

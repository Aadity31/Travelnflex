import React, { useState } from 'react';
import { 
  ShoppingCartIcon, 
  ClockIcon, 
  MapPinIcon, 
  CalendarIcon,
  UsersIcon,
  ShieldCheckIcon,
  BoltIcon,
  XMarkIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { useCartStore } from '@/lib/cart/store';
import ToastContainer from '@/components/toast/Toast';
import { TrustBadges } from '../TrustBadges';

interface BookingSidebarProps {
  // Required
  price: number;
  title: string;
  activityId: string;
  activitySlug: string;
  location: string;

  // Optional
  description?: string;
  originalPrice?: number;
  nextDate?: string;
  remainingSeats?: number;
  cancellationPolicy?: string;
  onAddToCart?: () => void;
  category?: string;
  rating?: number;
  reviewCount?: number;
  duration?: string;
  currency?: string;
  difficulty?: string;
}

export default function BookingSidebar({
  price,
  originalPrice,
  nextDate,
  remainingSeats = 10,
  cancellationPolicy,
  onAddToCart,
  category,
  rating = 0,
  reviewCount = 0,
  location,
  duration,
  title,
  description,
  activityId,
  activitySlug,
  currency = 'INR',
  difficulty,
}: BookingSidebarProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const cart = useCartStore();

  // Currency symbol helper
  const getCurrencySymbol = (curr: string): string => {
    const symbols: Record<string, string> = {
      INR: '₹',
      USD: '$',
      EUR: '€',
      GBP: '£',
      AUD: 'A$',
      CAD: 'C$',
      JPY: '¥',
    };
    return symbols[curr?.toUpperCase()] || curr || '₹';
  };

  const currencySymbol = getCurrencySymbol(currency);
  const isInCart = activityId ? cart.isInCart(activityId) : false;
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  // Star rating renderer with full, half, and empty stars
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarSolid key={`full-${i}`} className="w-4 h-4 text-yellow-400" />
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <StarOutline className="w-4 h-4 text-yellow-400" />
          <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <StarSolid className="w-4 h-4 text-yellow-400" />
          </div>
        </div>
      );
    }

    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <StarOutline key={`empty-${i}`} className="w-5 h-5 text-gray-300" />
      );
    }

    return stars;
  };

  // Cart handlers
  const handleAddToCart = async () => {
    if (!activityId || !title || !activitySlug || !location) {
      console.error('Missing required activity data');
      return;
    }

    setIsAddingToCart(true);
    try {
      await cart.addToCartFromDetails(
        {
          id: activityId,
          name: title,
          slug: activitySlug,
          location: location,
          price: price,
        },
        1
      );
      onAddToCart?.();
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleRemoveFromCart = async () => {
    if (!activityId) return;

    setIsAddingToCart(true);
    try {
      await cart.removeFromCart(activityId);
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleCartClick = () => {
    if (isInCart) {
      handleRemoveFromCart();
    } else {
      handleAddToCart();
    }
  };

  return (
    <div className="sticky top-24 space-y-4">
      <ToastContainer toasts={cart.toasts} onHideToast={cart.hideToast} />

      {/* Main Booking Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">

        {/* Title & Category Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">
              {title}
            </h2>
            {category && (
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-lg text-xs font-semibold uppercase whitespace-nowrap">
                {category}
              </span>
            )}
          </div>


          {/* Rating with Stars */}
          {rating > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {renderStars(rating)}
              </div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-gray-900">{rating.toFixed(1)}</span>
                <span className="text-[.675rem] text-gray-500">
                  ({reviewCount.toLocaleString()} reviews)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Pricing Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-bold text-gray-900">
                  {currencySymbol}{price.toLocaleString()}
                </span>
                {originalPrice && originalPrice > price && (
                  <span className="text-lg text-gray-400 line-through">
                    {currencySymbol}{originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600">per person</p>
            </div>

            {discount > 0 && (
              <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-sm font-semibold">
                Save {discount}%
              </span>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="p-6 space-y-4 border-b border-gray-200">
          {/* Location */}
          <div className="flex items-center gap-3">
            <MapPinIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Location</p>
              <p className="text-sm font-medium text-gray-900">{location}</p>
            </div>
          </div>

          {/* Duration */}
          {duration && (
            <div className="flex items-center gap-3">
              <ClockIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Duration</p>
                <p className="text-sm font-medium text-gray-900">{duration}</p>
              </div>
            </div>
          )}

          {/* Next Available Date */}
          {nextDate && (
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Next Available</p>
                <p className="text-sm font-medium text-gray-900">{nextDate}</p>
              </div>
            </div>
          )}

          {/* Remaining Seats */}
          {remainingSeats && (
            <div className="flex items-center gap-3">
              <UsersIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Availability</p>
                <p className="text-sm font-medium text-orange-600">
                  {remainingSeats} {remainingSeats === 1 ? 'seat' : 'seats'} remaining
                </p>
              </div>
            </div>
          )}

          {/* Difficulty */}
          {difficulty && (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Difficulty</p>
                <p className="text-sm font-medium text-gray-900">{difficulty}</p>
              </div>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="p-6 space-y-3">
          <button
            onClick={handleCartClick}
            disabled={isAddingToCart}
            className={`
              w-full py-3.5 px-6 rounded-lg font-semibold text-base
              transition-all duration-200 
              flex items-center justify-center gap-2
              disabled:opacity-60 disabled:cursor-not-allowed
              ${isInCart
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-orange-500 hover:bg-orange-600 text-white'
              }
            `}
          >
            {isAddingToCart ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing</span>
              </>
            ) : isInCart ? (
              <>
                <XMarkIcon className="w-5 h-5" />
                <span>Remove from Cart</span>
              </>
            ) : (
              <>
                <ShoppingCartIcon className="w-5 h-5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          {/* Trust Indicators */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-3 py-2 rounded-lg flex-1 justify-center">
              <ShieldCheckIcon className="w-4 h-4" />
              <span>Verified</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 px-3 py-2 rounded-lg flex-1 justify-center">
              <BoltIcon className="w-4 h-4" />
              <span>Instant Booking</span>
            </div>
          </div>

          {/* Cancellation Policy */}
          {cancellationPolicy && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-600 flex items-start gap-2">
                <CheckCircleIcon className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <span>
                  <span className="font-semibold text-gray-900">Free cancellation</span>
                  <span className="block mt-0.5">{cancellationPolicy}</span>
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Trust & Terms Card */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <TrustBadges />

        {/* Terms */}
        <p className="text-xs text-gray-500 text-center mt-4">
          By booking, you agree to our{' '}
          <a
            href="/terms-and-conditions"
            className="text-orange-600 hover:text-orange-700 font-medium hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms & Conditions
          </a>
          {' '}and{' '}
          <a
            href="/privacy-policy"
            className="text-orange-600 hover:text-orange-700 font-medium hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
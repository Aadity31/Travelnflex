// app/components/booking/ReviewsSection.tsx

"use client";

import { useState } from "react";
import { StarIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { Review, getAverageRating, getRatingDistribution } from "@/lib/bookingSection/reviews";

interface ReviewsSectionProps {
  reviews: Review[];
  fallbackRating?: number;
  fallbackReviewCount?: number;
}

export function ReviewsSection({ 
  reviews, 
  fallbackRating = 0, 
  fallbackReviewCount = 0 
}: ReviewsSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 5;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const averageRating = getAverageRating(reviews, fallbackRating);
  const ratingDistribution = getRatingDistribution(reviews);

  return (
    <section className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 mt-8">
      <h2 className="text-lg font-bold text-gray-900 mb-4">
        Customer Reviews
      </h2>

      {/* Rating Overview */}
      <div className="flex items-start gap-6 mb-6 pb-5 border-b border-gray-200">
        {/* Average Rating */}
        <div className="flex flex-col items-center">
          <div className="text-4xl font-bold text-gray-900 mb-1">
            {averageRating}
          </div>
          <div className="flex items-center gap-0.5 mb-1">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(parseFloat(averageRating))
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-600">
            {reviews.length || fallbackReviewCount} reviews
          </p>
        </div>

        {/* Rating Bars */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((rating, idx) => {
            const count = ratingDistribution[idx];
            const totalReviews = reviews.length || 1;
            const percentage = (count / totalReviews) * 100;
            return (
              <div key={rating} className="flex items-center gap-2">
                <div className="flex items-center gap-0.5 w-16">
                  <span className="text-xs text-gray-700 font-medium">
                    {rating}
                  </span>
                  <StarIcon className="w-3 h-3 text-gray-400" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600 w-10 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          <>
            {reviews
              .slice(
                currentPage * reviewsPerPage,
                (currentPage + 1) * reviewsPerPage
              )
              .map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold flex-shrink-0 text-sm">
                      {review.userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {review.userName}
                        </h4>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs text-gray-500">
                          {new Date(review.date).toLocaleDateString(
                            "en-IN",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < review.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(0, prev - 1))
                  }
                  disabled={currentPage === 0}
                  className="p-2 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx)}
                      className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                        currentPage === idx
                          ? "bg-orange-500 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(totalPages - 1, prev + 1)
                    )
                  }
                  disabled={currentPage === totalPages - 1}
                  className="p-2 rounded-md border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRightIcon className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center gap-0.5 mb-2">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="w-6 h-6 text-gray-300" />
              ))}
            </div>
            <p className="text-gray-600 font-medium text-sm mb-1">
              No reviews yet
            </p>
            <p className="text-xs text-gray-500">
              Be the first to share your experience!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";

// Types
interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  location: string;
  designation?: string;
  rating: number;
  review: string;
  activity: string;
  date: string;
  verified: boolean;
  images?: string[];
}

// Mock testimonials data
const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    location: "New York, USA",
    designation: "Yoga Instructor",
    rating: 5,
    review:
      "The Ganga Aarti experience in Haridwar was absolutely divine. Our guide Rajesh made sure we got the best spots and explained every ritual beautifully.",
    activity: "Evening Ganga Aarti",
    date: "2025-09-15",
    verified: true,
    images: [
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop",
    ],
  },
  {
    id: "2",
    name: "Amit Sharma",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    location: "Delhi, India",
    designation: "Software Engineer",
    rating: 5,
    review:
      "River rafting in Rishikesh was thrilling! The platform made booking so easy and the guides were professional and fun. Safety was their top priority.",
    activity: "White Water Rafting",
    date: "2025-09-10",
    verified: true,
    images: [
      "https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=400&h=300&fit=crop",
    ],
  },
  {
    id: "3",
    name: "Maria Rodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    location: "Barcelona, Spain",
    designation: "Travel Blogger",
    rating: 5,
    review:
      "My yoga retreat in Rishikesh was life-changing. The ashram was peaceful, the teachers were incredibly knowledgeable, and the sunrise sessions by the Ganges were magical.",
    activity: "Sunrise Yoga Session",
    date: "2025-09-08",
    verified: true,
    images: ["https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"],
  },
  {
    id: "4",
    name: "James Wilson",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    location: "London, UK",
    designation: "Adventure Enthusiast",
    rating: 5,
    review:
      "Bungee jumping from 83 meters was the most exhilarating experience of my life! The safety standards were excellent and the staff made sure I felt confident.",
    activity: "Bungee Jumping",
    date: "2025-09-05",
    verified: true,
    images: [
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400&h=300&fit=crop",
    ],
  },
  {
    id: "5",
    name: "Priya Patel",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    location: "Mumbai, India",
    designation: "Marketing Manager",
    rating: 5,
    review:
      "The temple tour in Haridwar was incredibly enlightening. Our local guide shared fascinating stories about each temple's history and significance.",
    activity: "Ancient Temples Tour",
    date: "2025-09-03",
    verified: true,
    images: [
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=400&h=300&fit=crop",
    ],
  },
  {
    id: "6",
    name: "David Chen",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    location: "Sydney, Australia",
    designation: "Photographer",
    rating: 5,
    review:
      "The Himalayan trek was breathtaking! Hidden waterfalls, pristine nature trails, and stunning mountain views. Perfect for nature photographers.",
    activity: "Himalayan Nature Trek",
    date: "2025-08-28",
    verified: true,
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=300&fit=crop",
    ],
  },
];

// Star Rating Component
interface StarRatingProps {
  rating: number;
  size?: "sm" | "md";
}

const StarRating: React.FC<StarRatingProps> = ({ rating, size = "md" }) => {
  const sizeClasses = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <StarSolidIcon
          key={i}
          className={`${sizeClasses} ${
            i < rating ? "text-amber-400" : "text-gray-200"
          }`}
        />
      ))}
    </div>
  );
};

// Verified Badge Component
const VerifiedBadge: React.FC = () => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
    Verified
  </span>
);

// Testimonial Card Component
interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <article className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-500 h-full flex flex-col">
      {/* Header - Avatar & Info */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative flex-shrink-0">
          {!imageError ? (
            <Image
              src={testimonial.avatar}
              alt={`${testimonial.name}`}
              width={56}
              height={56}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-orange-100"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {testimonial.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
          )}
        </div>

        <div className="flex-grow min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {testimonial.name}
          </h3>
          <p className="text-sm text-gray-500 truncate">{testimonial.location}</p>
          {testimonial.designation && (
            <p className="text-sm text-orange-600 truncate">
              {testimonial.designation}
            </p>
          )}
        </div>

        <div className="flex-shrink-0">
          <StarRating rating={testimonial.rating} size="sm" />
        </div>
      </div>

      {/* Review */}
      <div className="relative flex-grow mb-4">
        <ChatBubbleLeftRightIcon className="w-8 h-8 text-orange-100 mb-2" />
        <blockquote className="text-gray-600 leading-relaxed text-sm line-clamp-4">
          &ldquo;{testimonial.review}&rdquo;
        </blockquote>
      </div>

      {/* Activity & Date */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
            {testimonial.activity}
          </span>
        </div>
        <span className="text-xs text-gray-400">
          {new Date(testimonial.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>

      {/* Trip Images */}
      {testimonial.images && testimonial.images.length > 0 && (
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
          {testimonial.images.slice(0, 3).map((image, idx) => (
            <div
              key={idx}
              className="relative w-12 h-12 rounded-lg overflow-hidden"
            >
              <Image
                src={image}
                alt={`Trip photo ${idx + 1}`}
                fill
                sizes="48px"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          ))}
          {testimonial.images.length > 3 && (
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-medium">
              +{testimonial.images.length - 3}
            </div>
          )}
        </div>
      )}
    </article>
  );
};

// Main TestimonialsSection Component
const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(3);

  // Responsive items per view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, maxIndex]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const goToSlide = useCallback(
    (index: number) => {
      setCurrentIndex(Math.min(index, maxIndex));
    },
    [maxIndex]
  );

  // Derived values
  const visibleTestimonials = testimonials.slice(
    currentIndex,
    currentIndex + itemsPerView
  );
  const averageRating =
    testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;

  // Stats
  const stats = [
    { value: `${averageRating.toFixed(1)}`, label: "Average Rating" },
    { value: `${testimonials.length}+`, label: "Happy Travelers" },
    { value: `${testimonials.filter((t) => t.verified).length}`, label: "Verified Reviews" },
  ];

  return (
    <section className="py-16 md:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 text-sm font-medium rounded-full mb-4">
            Customer Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            What Our Travelers{" "}
            <span className="text-orange-600">Say About Us</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real experiences from travelers who discovered the magic of
            Rishikesh and Haridwar with our expert guides.
          </p>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 md:gap-16 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={goToPrevious}
              disabled={currentIndex === 0}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:bg-orange-50 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              aria-label="Previous testimonials"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? "bg-orange-600 w-6"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goToNext}
              disabled={currentIndex >= maxIndex}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:bg-orange-50 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              aria-label="Next testimonials"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleTestimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button
            onClick={() => (window.location.href = "/reviews")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white font-medium rounded-full hover:bg-orange-700 transition-colors duration-300"
          >
            Read All Reviews
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

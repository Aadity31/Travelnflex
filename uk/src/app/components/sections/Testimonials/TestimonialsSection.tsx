"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChatBubbleLeftRightIcon,
  PlayIcon,
  PauseIcon,
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
    avatar: "/images/testimonials/sarah-johnson.jpg",
    location: "New York, USA",
    designation: "Yoga Instructor",
    rating: 5,
    review:
      "The Ganga Aarti experience in Haridwar was absolutely divine. Our guide Rajesh made sure we got the best spots and explained every ritual beautifully. The spiritual energy was overwhelming and transformative.",
    activity: "Evening Ganga Aarti",
    date: "2025-09-15",
    verified: true,
    images: [
      "/images/testimonials/sarah-trip-1.jpg",
      "/images/testimonials/sarah-trip-2.jpg",
    ],
  },
  {
    id: "2",
    name: "Amit Sharma",
    avatar: "/images/testimonials/amit-sharma.jpg",
    location: "Delhi, India",
    designation: "Software Engineer",
    rating: 5,
    review:
      "River rafting in Rishikesh was thrilling! The platform made booking so easy and the guides were professional and fun. Safety was their top priority and we felt completely secure throughout the adventure.",
    activity: "White Water Rafting",
    date: "2025-09-10",
    verified: true,
  },
  {
    id: "3",
    name: "Maria Rodriguez",
    avatar: "/images/testimonials/maria-rodriguez.jpg",
    location: "Barcelona, Spain",
    designation: "Travel Blogger",
    rating: 5,
    review:
      "My yoga retreat in Rishikesh was life-changing. The ashram was peaceful, the teachers were incredibly knowledgeable, and the sunrise sessions by the Ganges were magical. Highly recommended for spiritual seekers.",
    activity: "Sunrise Yoga Session",
    date: "2025-09-08",
    verified: true,
    images: ["/images/testimonials/maria-trip-1.jpg"],
  },
  {
    id: "4",
    name: "James Wilson",
    avatar: "/images/testimonials/james-wilson.jpg",
    location: "London, UK",
    designation: "Adventure Enthusiast",
    rating: 4,
    review:
      "Bungee jumping from 83 meters was the most exhilarating experience of my life! The safety standards were excellent and the staff made sure I felt confident before the jump. An absolute must-do in Rishikesh.",
    activity: "Bungee Jumping",
    date: "2025-09-05",
    verified: true,
  },
  {
    id: "5",
    name: "Priya Patel",
    avatar: "/images/testimonials/priya-patel.jpg",
    location: "Mumbai, India",
    designation: "Marketing Manager",
    rating: 5,
    review:
      "The temple tour in Haridwar was incredibly enlightening. Our local guide shared fascinating stories about each temple's history and significance. The entire experience felt authentic and deeply spiritual.",
    activity: "Ancient Temples Tour",
    date: "2025-09-03",
    verified: true,
  },
  {
    id: "6",
    name: "David Chen",
    avatar: "/images/testimonials/david-chen.jpg",
    location: "Sydney, Australia",
    designation: "Photographer",
    rating: 5,
    review:
      "The Himalayan trek was breathtaking! Hidden waterfalls, pristine nature trails, and stunning mountain views. Our guide was very knowledgeable about local flora and fauna. Perfect for nature photographers.",
    activity: "Himalayan Nature Trek",
    date: "2025-08-28",
    verified: true,
    images: [
      "/images/testimonials/david-trip-1.jpg",
      "/images/testimonials/david-trip-2.jpg",
    ],
  },
];

// Star Rating Component
interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-3 h-3 sm:w-4 sm:h-4",
    md: "w-4 h-4 sm:w-5 sm:h-5",
    lg: "w-5 h-5 sm:w-6 sm:h-6",
  };

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(maxRating)].map((_, i) => (
        <StarSolidIcon
          key={i}
          className={`${sizeClasses[size]} ${
            i < rating ? "text-yellow-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

// Testimonial Card Component
interface TestimonialCardProps {
  testimonial: Testimonial;
  isActive: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  isActive,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={`transition-all duration-500 ${
        isActive ? "opacity-100 scale-100" : "opacity-70 scale-95"
      }`}
    >
      <article className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 mx-1 sm:mx-2 relative overflow-hidden h-full">
        <div className="absolute top-0 right-0 w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 opacity-5">
          <ChatBubbleLeftRightIcon className="w-full h-full text-orange-600" />
        </div>

        <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6 relative z-10">
          <div className="relative flex-shrink-0">
            {!imageError ? (
              <Image
                src={testimonial.avatar}
                alt={`${testimonial.name} - Customer photo`}
                width={56}
                height={56}
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full object-cover ring-2 sm:ring-4 ring-orange-100"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg md:text-xl">
                {testimonial.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            )}
            {testimonial.verified && (
              <div className="absolute -bottom-0.5 sm:-bottom-1 -right-0.5 sm:-right-1 bg-green-500 rounded-full p-0.5 sm:p-1">
                <svg
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>

          <div className="flex-grow min-w-0">
            <div className="flex items-center justify-between mb-1 sm:mb-2 gap-2">
              <h3 className="font-bold text-base sm:text-lg text-gray-900 truncate">
                {testimonial.name}
              </h3>
              <StarRating rating={testimonial.rating} size="sm" />
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-0.5 sm:mb-1 truncate">
              {testimonial.location}
            </p>
            {testimonial.designation && (
              <p className="text-xs sm:text-sm text-orange-600 font-medium truncate">
                {testimonial.designation}
              </p>
            )}
          </div>
        </div>

        <blockquote className="text-gray-700 leading-relaxed mb-4 sm:mb-6 relative z-10">
          <ChatBubbleLeftRightIcon className="w-5 h-5 sm:w-6 sm:h-6 text-orange-300 mb-1 sm:mb-2" />
          <p className="text-sm sm:text-base md:text-lg italic line-clamp-4 sm:line-clamp-none">{`"${testimonial.review}"`}</p>
        </blockquote>

        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 gap-2">
          <span className="bg-orange-50 text-orange-700 px-2 sm:px-3 py-1 rounded-full font-medium truncate">
            {testimonial.activity}
          </span>
          <span className="flex-shrink-0 text-[10px] sm:text-xs">
            {new Date(testimonial.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        {testimonial.images && testimonial.images.length > 0 && (
          <div className="flex gap-1.5 sm:gap-2 mt-3 sm:mt-4">
            {testimonial.images.slice(0, 3).map((image) => (
              <div
                key={image}
                className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg overflow-hidden"
              >
                <Image
                  src={image}
                  alt={`${testimonial.name}'s trip photo`}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))}
            {testimonial.images.length > 3 && (
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 text-[10px] sm:text-xs font-medium">
                +{testimonial.images.length - 3}
              </div>
            )}
          </div>
        )}
      </article>
    </div>
  );
};

// Main TestimonialsSection Component
const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const itemsPerView = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
  };

  const [currentItemsPerView, setCurrentItemsPerView] = useState(
    itemsPerView.desktop
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCurrentItemsPerView(itemsPerView.mobile);
      } else if (window.innerWidth < 1024) {
        setCurrentItemsPerView(itemsPerView.tablet);
      } else {
        setCurrentItemsPerView(itemsPerView.desktop);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [itemsPerView.mobile, itemsPerView.tablet, itemsPerView.desktop]);

  const maxIndex = Math.max(0, testimonials.length - currentItemsPerView);

  useEffect(() => {
    if (isAutoPlaying && !isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }, 5000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAutoPlaying, isPaused, maxIndex]);

  const goToPrevious = () =>
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  const goToNext = () =>
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  const goToSlide = (index: number) =>
    setCurrentIndex(Math.min(index, maxIndex));
  const toggleAutoPlay = () => setIsAutoPlaying(!isAutoPlaying);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  const visibleTestimonials = testimonials.slice(
    currentIndex,
    currentIndex + currentItemsPerView
  );
  const averageRating =
    testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;
  const totalReviews = testimonials.length;
  const verifiedCount = testimonials.filter((t) => t.verified).length;

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <div className="inline-block bg-orange-100 text-orange-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
            Customer Stories
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 px-4">
            What Our Travelers
            <span className="text-orange-600 block mt-1">Say About Us</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4">
            Real experiences from real travelers who discovered the magic of
            Rishikesh and Haridwar with our expert guides.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 px-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1 sm:mb-2">
                <StarRating rating={Math.floor(averageRating)} size="sm" />
                <span className="font-bold text-lg sm:text-xl md:text-2xl text-gray-900 ml-1 sm:ml-2">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-600">
                Average Rating
              </p>
            </div>
            <div className="w-px h-8 sm:h-10 md:h-12 bg-gray-300"></div>
            <div className="text-center">
              <div className="font-bold text-lg sm:text-xl md:text-2xl text-gray-900 mb-1 sm:mb-2">
                {totalReviews}+
              </div>
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-600">
                Happy Travelers
              </p>
            </div>
            <div className="w-px h-8 sm:h-10 md:h-12 bg-gray-300"></div>
            <div className="text-center">
              <div className="font-bold text-lg sm:text-xl md:text-2xl text-gray-900 mb-1 sm:mb-2">
                {verifiedCount}
              </div>
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-600">
                Verified Reviews
              </p>
            </div>
          </div>
        </div>

        <div
          className="relative px-8 sm:px-10 md:px-12"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            onClick={goToPrevious}
            disabled={currentIndex === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 z-10 bg-white shadow-lg rounded-full p-2 sm:p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            aria-label="Previous testimonials"
          >
            <ChevronLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-600" />
          </button>

          <button
            onClick={goToNext}
            disabled={currentIndex >= maxIndex}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 z-10 bg-white shadow-lg rounded-full p-2 sm:p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            aria-label="Next testimonials"
          >
            <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-600" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {visibleTestimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                isActive={true}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-10 md:mt-12">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? "bg-orange-600 scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to testimonial set ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={toggleAutoPlay}
            className="flex items-center gap-2 bg-white border border-gray-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-gray-50 transition-colors duration-200"
            aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            {isAutoPlaying ? (
              <PauseIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
            ) : (
              <PlayIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
            )}
            <span className="text-xs sm:text-sm text-gray-600">
              {isAutoPlaying ? "Pause" : "Play"}
            </span>
          </button>
        </div>

        <div className="text-center mt-10 sm:mt-12 md:mt-16 px-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 max-w-2xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Ready to Create Your Own Story?
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6">
              Join thousands of satisfied travelers and experience the magic of
              sacred India with our expert local guides.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold transition-colors duration-200 text-sm sm:text-base">
                Book Trip Now
              </button>
              <button className="bg-transparent border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base">
                Contact Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

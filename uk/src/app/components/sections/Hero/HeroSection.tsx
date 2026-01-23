"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon, PlayCircleIcon } from "@heroicons/react/24/outline";

const heroSlides = [
  {
    id: 1,
    image: "/images/rishikesh-ganga-arti.jpg",
    title: "Discover Sacred Adventures",
    subtitle:
      "Experience spiritual journeys with expert local guides along the holy Ganges",
    cta: "Book Your Journey",
    secondaryCta: "Watch Video",
  },
  {
    id: 2,
    image: "/images/river-rafting-rishikesh.jpg",
    title: "Thrilling Adventures Await",
    subtitle: "White-water rafting to bungee jumping in the Himalayas",
    cta: "Explore Activities",
    secondaryCta: "View Gallery",
  },
  {
    id: 3,
    image: "/images/yoga-ashram-rishikesh.jpg",
    title: "Find Your Inner Peace",
    subtitle: "Authentic yoga retreats at world-renowned ashrams",
    cta: "Book Retreat",
    secondaryCta: "Learn More",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const currentHero = heroSlides[currentSlide];

  return (
    <section className="relative h-[75vh] sm:h-[80vh] md:h-[85vh] lg:h-[90vh] overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-10 sm:top-16 md:top-20 right-10 sm:right-16 md:right-20 w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 bg-orange-500 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-10 sm:bottom-16 md:bottom-20 left-10 sm:left-16 md:left-20 w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 bg-red-500 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Content - Bottom Aligned */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pb-16 sm:pb-20 md:pb-24 lg:pb-32">
        <div className="text-center text-white max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Title with Animation */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3 leading-tight animate-slide-up">
            {currentHero.title}
          </h1>

          {/* Subtitle */}
          <p
            className="text-sm sm:text-base md:text-lg lg:text-xl mb-5 sm:mb-6 max-w-2xl mx-auto leading-relaxed text-white/90 animate-slide-up px-2 sm:px-0"
            style={{ animationDelay: "0.2s" }}
          >
            {currentHero.subtitle}
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-slide-up mb-6 sm:mb-8 px-2 sm:px-0"
            style={{ animationDelay: "0.4s" }}
          >
            <Link
              href="/destinations"
              className="w-full sm:w-auto group bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 sm:px-7 py-3 sm:py-3.5 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {currentHero.cta}
              <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button className="w-full sm:w-auto group bg-white/10 backdrop-blur-md border-2 border-white/50 hover:bg-white hover:text-orange-600 text-white px-6 sm:px-7 py-3 sm:py-3.5 rounded-full font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base">
              <PlayCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
              {currentHero.secondaryCta}
            </button>
          </div>

          {/* Stats/Features */}
          <div
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 text-[10px] sm:text-xs md:text-sm animate-fade-in px-2"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>5000+ Happy Travelers</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span>50+ Sacred Sites</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>Expert Local Guides</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? "w-6 sm:w-8 h-1.5 sm:h-2 bg-white"
                : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

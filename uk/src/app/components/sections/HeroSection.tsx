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
    badge: "✨ Most Popular",
  },
  {
    id: 2,
    image: "/images/river-rafting-rishikesh.jpg",
    title: "Thrilling Adventures Await",
    subtitle: "White-water rafting to bungee jumping in the Himalayas",
    cta: "Explore Activities",
    secondaryCta: "View Gallery",
    badge: "🏔️ Adventure",
  },
  {
    id: 3,
    image: "/images/yoga-ashram-rishikesh.jpg",
    title: "Find Your Inner Peace",
    subtitle: "Authentic yoga retreats at world-renowned ashrams",
    cta: "Book Retreat",
    secondaryCta: "Learn More",
    badge: "🧘 Wellness",
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
    <section className="relative h-[85vh] md:h-[90vh] overflow-hidden">
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
        <div className="absolute top-20 right-20 w-72 h-72 bg-orange-500 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 left-20 w-80 h-80 bg-red-500 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Content - Bottom Aligned */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pb-24 md:pb-32">
        <div className="text-center text-white max-w-5xl mx-auto px-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-sm font-medium mb-4 animate-fade-in">
            {currentHero.badge}
          </div>

          {/* Title with Animation */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 leading-tight animate-slide-up">
            {currentHero.title}
          </h1>

          {/* Subtitle */}
          <p
            className="text-base md:text-lg lg:text-xl mb-6 max-w-2xl mx-auto leading-relaxed text-white/90 animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            {currentHero.subtitle}
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up mb-8"
            style={{ animationDelay: "0.4s" }}
          >
            <Link
              href="/packages"
              className="group bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-7 py-3.5 rounded-full font-semibold transition-all duration-300 hover:scale-105 shadow-xl shadow-orange-500/30 flex items-center gap-2"
            >
              {currentHero.cta}
              <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button className="group bg-white/10 backdrop-blur-md border-2 border-white/50 hover:bg-white hover:text-orange-600 text-white px-7 py-3.5 rounded-full font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-2">
              <PlayCircleIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {currentHero.secondaryCta}
            </button>
          </div>

          {/* Stats/Features */}
          <div
            className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-xs md:text-sm animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>5000+ Happy Travelers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span>50+ Sacred Sites</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span>Expert Local Guides</span>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? "w-8 h-2 bg-white"
                : "w-2 h-2 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 hidden md:block z-10 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-white/70">
          <span className="text-xs font-medium">Scroll</span>
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

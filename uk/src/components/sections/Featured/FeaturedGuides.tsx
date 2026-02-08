"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  UserGroupIcon,
  LanguageIcon,
  BuildingOffice2Icon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import {
  StarIcon as StarSolidIcon,
  HeartIcon as HeartSolidIcon,
  CheckBadgeIcon as CheckBadgeSolidIcon,
} from "@heroicons/react/24/solid";

// =====================
// TYPES
// =====================
interface TravelAgency {
  id: string;
  name: string;
  logo: string;
  location: string;
  specialties: string[];
  languages: string[];
  experience: number; // years in business
  rating: number;
  reviewCount: number;
  startingPrice: number; // ₹
  isVerified: boolean;
  isTopRated: boolean;
  isOnline: boolean;
  responseTime: string;
  completedTours: number;
  description: string;
  certifications: string[];
  availabilityStatus: "available" | "busy" | "offline";
  joinedDate: string;
  profileImages: string[];
  expertise: {
    spiritual: number;
    adventure: number;
    cultural: number;
    budget: number;
  };
}

// =====================
// MOCK DATA
// =====================
const featuredAgencies: TravelAgency[] = [
  {
    id: "agency-1",
    name: "Garhwal Trails",
    logo: "https://www.chardham-tours.com/wp-content/uploads/2020/01/yoga.jpg",
    location: "Dehradun, Uttarakhand",
    specialties: ["Char Dham Yatra", "Spiritual Tours", "Family Packages", "Luxury Travel"],
    languages: ["Hindi", "English"],
    experience: 14,
    rating: 4.9,
    reviewCount: 620,
    startingPrice: 8999,
    isVerified: true,
    isTopRated: true,
    isOnline: true,
    responseTime: "Within 30 minutes",
    completedTours: 2400,
    description:
      "Leading Uttarakhand-based travel agency specializing in Char Dham Yatra, luxury Himalayan tours, and fully customized pilgrimage experiences. Known for safety, reliability, and premium service.",
    certifications: ["Government Registered", "Tourism Board Certified", "ISO 9001"],
    availabilityStatus: "available",
    joinedDate: "2017-02-12",
    profileImages: ["/images/agencies/garhwal-1.jpg", "/images/agencies/garhwal-2.jpg"],
    expertise: {
      spiritual: 5,
      adventure: 3,
      cultural: 5,
      budget: 4,
    },
  },
  {
    id: "agency-2",
    name: "Himalayan Adventures",
    logo: "https://www.chardham-tours.com/wp-content/uploads/2020/01/yoga.jpg",
    location: "Rishikesh, Uttarakhand",
    specialties: ["Trekking", "River Rafting", "Corporate Tours", "Student Trips"],
    languages: ["Hindi", "English"],
    experience: 10,
    rating: 4.7,
    reviewCount: 410,
    startingPrice: 4999,
    isVerified: true,
    isTopRated: false,
    isOnline: true,
    responseTime: "Within 1 hour",
    completedTours: 1600,
    description:
      "Adventure-focused travel agency delivering high-energy Himalayan trekking, rafting, and corporate adventure retreats. Trusted for certified guides and safety-first operations.",
    certifications: ["Adventure Tourism Certified", "Safety Compliance Partner"],
    availabilityStatus: "available",
    joinedDate: "2019-06-08",
    profileImages: ["/images/agencies/himalayan-1.jpg"],
    expertise: {
      spiritual: 2,
      adventure: 5,
      cultural: 3,
      budget: 4,
    },
  },
  {
    id: "agency-3",
    name: "Divine Yatra Services",
    logo: "https://www.chardham-tours.com/wp-content/uploads/2020/01/yoga.jpg",
    location: "Haridwar, Uttarakhand",
    specialties: ["Pilgrimage Tours", "Senior Citizen Packages", "Budget Travel"],
    languages: ["Hindi", "English", "Gujarati"],
    experience: 18,
    rating: 4.8,
    reviewCount: 540,
    startingPrice: 3999,
    isVerified: true,
    isTopRated: true,
    isOnline: false,
    responseTime: "Within 2 hours",
    completedTours: 3100,
    description:
      "Specialized pilgrimage agency offering affordable and senior-friendly Char Dham, Haridwar, and Rishikesh travel packages with full logistics and medical support.",
    certifications: ["Government Registered", "Senior Travel Specialist"],
    availabilityStatus: "busy",
    joinedDate: "2015-09-21",
    profileImages: ["/images/agencies/divine-1.jpg"],
    expertise: {
      spiritual: 5,
      adventure: 1,
      cultural: 4,
      budget: 5,
    },
  },
  {
    id: "agency-4",
    name: "Uttarakhand Explorers",
    logo: "https://www.chardham-tours.com/wp-content/uploads/2020/01/yoga.jpg",
    location: "Nainital, Uttarakhand",
    specialties: ["Hill Station Tours", "Photography Trips", "Honeymoon Packages"],
    languages: ["Hindi", "English"],
    experience: 7,
    rating: 4.6,
    reviewCount: 210,
    startingPrice: 6999,
    isVerified: true,
    isTopRated: false,
    isOnline: true,
    responseTime: "Within 45 minutes",
    completedTours: 780,
    description:
      "Boutique travel agency curating scenic hill-station tours, romantic getaways, and photography-focused itineraries across Uttarakhand.",
    certifications: ["Tourism Board Partner"],
    availabilityStatus: "available",
    joinedDate: "2021-04-15",
    profileImages: ["/images/agencies/explorer-1.jpg"],
    expertise: {
      spiritual: 2,
      adventure: 3,
      cultural: 4,
      budget: 3,
    },
  },
];

// =====================
// STAR RATING
// =====================
interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
  reviewCount?: number;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = "sm",
  showNumber = false,
  reviewCount,
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[...Array(maxRating)].map((_, index) => (
          <StarSolidIcon
            key={index}
            className={`${sizeClasses[size]} ${
              index < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
      {showNumber && (
        <span className="text-sm font-semibold text-gray-900">
          {rating.toFixed(1)}
        </span>
      )}
      {reviewCount && (
        <span className="text-xs text-gray-500">({reviewCount})</span>
      )}
    </div>
  );
};

// =====================
// EXPERTISE METER
// =====================
interface ExpertiseMeterProps {
  label: string;
  level: number;
  maxLevel?: number;
}

const ExpertiseMeter: React.FC<ExpertiseMeterProps> = ({
  label,
  level,
  maxLevel = 5,
}) => {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-gray-600 capitalize">{label}</span>
      <div className="flex items-center gap-1">
        {[...Array(maxLevel)].map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index < level ? "bg-orange-500" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// =====================
// AGENCY CARD
// =====================
interface AgencyCardProps {
  agency: TravelAgency;
  isLiked: boolean;
  onLikeToggle: (agencyId: string) => void;
}

const AgencyCard: React.FC<AgencyCardProps> = ({
  agency,
  isLiked,
  onLikeToggle,
}) => {
  const [imageError, setImageError] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "busy":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const getAvailabilityText = (status: string) => {
    switch (status) {
      case "available":
        return "Accepting Bookings";
      case "busy":
        return "Limited Availability";
      case "offline":
        return "Offline";
      default:
        return "Unknown";
    }
  };

  return (
    <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      {/* Header */}
      <div className="relative p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              {!imageError ? (
                <Image
                  src={agency.logo}
                  alt={`${agency.name} - Travel Agency`}
                  width={80}
                  height={80}
                  className="rounded-full object-cover ring-4 ring-orange-100"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl ring-4 ring-orange-100">
                  {agency.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
              )}

              {/* Status */}
              <div
                className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-white flex items-center justify-center ${getAvailabilityColor(
                  agency.availabilityStatus
                )}`}
              >
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>

              {/* Verified */}
              {agency.isVerified && (
                <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-1">
                  <CheckBadgeSolidIcon className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <div className="flex-grow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {agency.name}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <MapPinIcon className="w-4 h-4" />
                    <span className="text-sm">{agency.location}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onLikeToggle(agency.id);
                  }}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  {isLiked ? (
                    <HeartSolidIcon className="w-5 h-5 text-red-500" />
                  ) : (
                    <HeartIcon className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <StarRating
                  rating={agency.rating}
                  showNumber={true}
                  reviewCount={agency.reviewCount}
                />
                {agency.isTopRated && (
                  <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-semibold">
                    Top Agency
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-sm">
                <div
                  className={`w-2 h-2 rounded-full ${getAvailabilityColor(
                    agency.availabilityStatus
                  )}`}
                ></div>
                <span className="text-gray-600">
                  {getAvailabilityText(agency.availabilityStatus)}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">
                  Responds {agency.responseTime.toLowerCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-100">
          <div className="text-center">
            <div className="font-bold text-lg text-gray-900">
              {agency.experience}
            </div>
            <div className="text-xs text-gray-600">Years</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-gray-900">
              {agency.completedTours}
            </div>
            <div className="text-xs text-gray-600">Tours</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-orange-600">
              ₹{agency.startingPrice}
            </div>
            <div className="text-xs text-gray-600">Starting From</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6">
        {/* Specialties */}
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-2">Packages</h4>
          <div className="flex flex-wrap gap-2">
            {agency.specialties.slice(0, 3).map((specialty, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
              >
                {specialty}
              </span>
            ))}
            {agency.specialties.length > 3 && (
              <span className="text-xs text-gray-500 px-2 py-1">
                +{agency.specialties.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Languages */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <LanguageIcon className="w-4 h-4" />
            <span>Support: {agency.languages.join(", ")}</span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <p
            className={`text-gray-700 text-sm leading-relaxed ${
              showFullDescription ? "" : "line-clamp-3"
            }`}
          >
            {agency.description}
          </p>
          {agency.description.length > 150 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-orange-600 text-sm font-medium mt-1 hover:text-orange-700"
            >
              {showFullDescription ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        {/* Expertise */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Expertise</h4>
          <div className="space-y-2">
            <ExpertiseMeter
              label="spiritual"
              level={agency.expertise.spiritual}
            />
            <ExpertiseMeter
              label="adventure"
              level={agency.expertise.adventure}
            />
            <ExpertiseMeter
              label="cultural"
              level={agency.expertise.cultural}
            />
            <ExpertiseMeter
              label="budget"
              level={agency.expertise.budget}
            />
          </div>
        </div>

        {/* Certifications */}
        {agency.certifications.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <BuildingOffice2Icon className="w-4 h-4" />
              <span className="font-medium">Registered:</span>
              <span>{agency.certifications[0]}</span>
              {agency.certifications.length > 1 && (
                <span className="text-orange-600">
                  +{agency.certifications.length - 1} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href={`/agencies/${agency.id}`}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-semibold text-center transition-colors duration-200 flex items-center justify-center gap-2"
          >
            View Agency
            <ChevronRightIcon className="w-4 h-4" />
          </Link>
          <button
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2"
            disabled={agency.availabilityStatus === "offline"}
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4" />
            Contact
          </button>
        </div>
      </div>
    </article>
  );
};

// =====================
// MAIN COMPONENT
// =====================
const FeaturedAgencies: React.FC = () => {
  const [likedAgencies, setLikedAgencies] = useState<Set<string>>(new Set());
  const [filterSpecialty, setFilterSpecialty] = useState<string>("all");

  const handleLikeToggle = (agencyId: string) => {
    setLikedAgencies((prev) => {
      const newLiked = new Set(prev);
      if (newLiked.has(agencyId)) {
        newLiked.delete(agencyId);
      } else {
        newLiked.add(agencyId);
      }
      return newLiked;
    });
  };

  const specialties = [
    "all",
    ...new Set(featuredAgencies.flatMap((a) => a.specialties)),
  ];

  const filteredAgencies =
    filterSpecialty === "all"
      ? featuredAgencies
      : featuredAgencies.filter((agency) =>
          agency.specialties.some((s) =>
            s.toLowerCase().includes(filterSpecialty.toLowerCase())
          )
        );

  const averageRating =
    featuredAgencies.reduce((sum, a) => sum + a.rating, 0) /
    featuredAgencies.length;

  const totalExperience = featuredAgencies.reduce(
    (sum, a) => sum + a.experience,
    0
  );

  const availableAgencies = featuredAgencies.filter(
    (a) => a.availabilityStatus === "available"
  ).length;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            About Us
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Discover Verified
            <span className="text-orange-600 block">Travel Partners</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Book your journey with reliable, government-registered travel
            agencies offering curated packages, transparent pricing, and
            end-to-end travel support across Uttarakhand.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <StarSolidIcon className="w-6 h-6 text-yellow-400" />
                <span className="font-bold text-2xl text-gray-900">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <p className="text-sm text-gray-600">Average Rating</p>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <div className="font-bold text-2xl text-gray-900 mb-2">
                {totalExperience}+
              </div>
              <p className="text-sm text-gray-600">Years in Business</p>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <div className="font-bold text-2xl text-green-600 mb-2">
                {availableAgencies}
              </div>
              <p className="text-sm text-gray-600">Accepting Bookings</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {specialties.slice(0, 6).map((specialty) => (
              <button
                key={specialty}
                onClick={() => setFilterSpecialty(specialty)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  filterSpecialty === specialty
                    ? "bg-orange-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {specialty === "all" ? "All Agencies" : specialty}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {filteredAgencies.map((agency) => (
            <AgencyCard
              key={agency.id}
              agency={agency}
              isLiked={likedAgencies.has(agency.id)}
              onLikeToggle={handleLikeToggle}
            />
          ))}
        </div>

        {/* Empty */}
        {filteredAgencies.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              No agencies found
            </h3>
            <p className="text-gray-600 mb-6">
              Try selecting a different category
            </p>
            <button
              onClick={() => setFilterSpecialty("all")}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Show All Agencies
            </button>
          </div>
        )}

        {/* CTA */}
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Looking for a Business Partner?
            </h3>
            <p className="text-gray-600 mb-6">
              Join our platform as a verified travel agency and connect with
              high-intent travelers searching for trusted local partners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/agencies"
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
              >
                Browse All Agencies
                <UserGroupIcon className="w-5 h-5" />
              </Link>
              <Link
                href="/partner"
                className="bg-transparent border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              >
                Become a Partner
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedAgencies;
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  StarIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  CheckBadgeIcon,
  PhoneIcon,
  HeartIcon,
  UserGroupIcon,
  LanguageIcon,
  AcademicCapIcon,
  GlobeAltIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { 
  StarIcon as StarSolidIcon, 
  HeartIcon as HeartSolidIcon,
  CheckBadgeIcon as CheckBadgeSolidIcon
} from '@heroicons/react/24/solid';

// Types
interface LocalGuide {
  id: string;
  name: string;
  avatar: string;
  location: string;
  specialities: string[];
  languages: string[];
  experience: number; // years
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  isVerified: boolean;
  isTopRated: boolean;
  isOnline: boolean;
  responseTime: string; // e.g., "Within 1 hour"
  completedTrips: number;
  description: string;
  certifications: string[];
  availabilityStatus: 'available' | 'busy' | 'offline';
  joinedDate: string;
  profileImages: string[];
  expertise: {
    spiritual: number; // 1-5 rating
    adventure: number;
    cultural: number;
    food: number;
  };
}

// Mock guides data
const featuredGuides: LocalGuide[] = [
  {
    id: 'guide-1',
    name: 'Rajesh Kumar',
    avatar: 'https://www.chardham-tours.com/wp-content/uploads/2020/01/yoga.jpg',
    location: 'Rishikesh',
    specialities: ['Spiritual Tours', 'Yoga Retreats', 'Temple Visits', 'Meditation'],
    languages: ['Hindi', 'English', 'Sanskrit'],
    experience: 12,
    rating: 4.9,
    reviewCount: 485,
    hourlyRate: 1500,
    isVerified: true,
    isTopRated: true,
    isOnline: true,
    responseTime: 'Within 30 minutes',
    completedTrips: 1200,
    description: 'Certified yoga instructor and spiritual guide with deep knowledge of Hindu philosophy and ancient traditions. Specializes in authentic ashram experiences.',
    certifications: ['Certified Yoga Teacher', 'Government Licensed Guide', 'First Aid Certified'],
    availabilityStatus: 'available',
    joinedDate: '2018-03-15',
    profileImages: ['/images/guides/rajesh-1.jpg', '/images/guides/rajesh-2.jpg'],
    expertise: {
      spiritual: 5,
      adventure: 3,
      cultural: 5,
      food: 4
    }
  },
  {
    id: 'guide-2',
    name: 'Priya Sharma',
    avatar: 'https://www.chardham-tours.com/wp-content/uploads/2020/01/yoga.jpg',
    location: 'Haridwar',
    specialities: ['Ganga Aarti', 'Temple Tours', 'Cultural Heritage', 'Photography'],
    languages: ['Hindi', 'English', 'Punjabi'],
    experience: 8,
    rating: 4.8,
    reviewCount: 320,
    hourlyRate: 1200,
    isVerified: true,
    isTopRated: false,
    isOnline: true,
    responseTime: 'Within 1 hour',
    completedTrips: 650,
    description: 'Local historian and cultural expert passionate about sharing the rich heritage of Haridwar. Expert in temple architecture and religious ceremonies.',
    certifications: ['Government Licensed Guide', 'Heritage Site Specialist'],
    availabilityStatus: 'available',
    joinedDate: '2020-01-20',
    profileImages: ['https://www.chardham-tours.com/wp-content/uploads/2020/01/yoga.jpg'],
    expertise: {
      spiritual: 5,
      adventure: 2,
      cultural: 5,
      food: 3
    }
  },
  {
    id: 'guide-3',
    name: 'Arjun Singh',
    avatar: 'https://www.chardham-tours.com/wp-content/uploads/2020/01/yoga.jpg',
    location: 'Rishikesh',
    specialities: ['River Rafting', 'Bungee Jumping', 'Trekking', 'Adventure Sports'],
    languages: ['Hindi', 'English'],
    experience: 10,
    rating: 4.7,
    reviewCount: 280,
    hourlyRate: 1800,
    isVerified: true,
    isTopRated: true,
    isOnline: false,
    responseTime: 'Within 2 hours',
    completedTrips: 890,
    description: 'Adventure sports enthusiast and certified safety instructor. Specialized in white water rafting and high-altitude adventure activities.',
    certifications: ['Rafting Instructor', 'Safety Equipment Certified', 'Wilderness First Aid'],
    availabilityStatus: 'busy',
    joinedDate: '2019-05-10',
    profileImages: ['https://www.chardham-tours.com/wp-content/uploads/2020/01/yoga.jpg', 'https://zydushospitals.com/public/theme/front/images/gastrointestinal-surgery.jpg'],
    expertise: {
      spiritual: 3,
      adventure: 5,
      cultural: 3,
      food: 2
    }
  },
  {
    id: 'guide-4',
    name: 'Kavita Devi',
    avatar: 'https://www.chardham-tours.com/wp-content/uploads/2020/01/yoga.jpg',
    location: 'Haridwar & Rishikesh',
    specialities: ['Food Tours', 'Local Cuisine', 'Market Visits', 'Cooking Classes'],
    languages: ['Hindi', 'English', 'Bengali'],
    experience: 6,
    rating: 4.6,
    reviewCount: 195,
    hourlyRate: 1000,
    isVerified: true,
    isTopRated: false,
    isOnline: true,
    responseTime: 'Within 45 minutes',
    completedTrips: 420,
    description: 'Local chef and food enthusiast offering authentic culinary experiences. Expert in traditional North Indian and local Garhwali cuisine.',
    certifications: ['Culinary Expert', 'Food Safety Certified'],
    availabilityStatus: 'available',
    joinedDate: '2021-08-05',
    profileImages: ['https://www.chardham-tours.com/wp-content/uploads/2020/01/yoga.jpg'],
    expertise: {
      spiritual: 3,
      adventure: 2,
      cultural: 4,
      food: 5
    }
  }
];

// Star Rating Component
interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  reviewCount?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  maxRating = 5, 
  size = 'sm', 
  showNumber = false,
  reviewCount 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[...Array(maxRating)].map((_, index) => (
          <StarSolidIcon
            key={index}
            className={`${sizeClasses[size]} ${
              index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
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
        <span className="text-xs text-gray-500">
          ({reviewCount})
        </span>
      )}
    </div>
  );
};

// Expertise Meter Component
interface ExpertiseMeterProps {
  label: string;
  level: number;
  maxLevel?: number;
}

const ExpertiseMeter: React.FC<ExpertiseMeterProps> = ({ label, level, maxLevel = 5 }) => {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-gray-600 capitalize">{label}</span>
      <div className="flex items-center gap-1">
        {[...Array(maxLevel)].map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index < level ? 'bg-orange-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Guide Card Component
interface GuideCardProps {
  guide: LocalGuide;
  isLiked: boolean;
  onLikeToggle: (guideId: string) => void;
}

const GuideCard: React.FC<GuideCardProps> = ({ guide, isLiked, onLikeToggle }) => {
  const [imageError, setImageError] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getAvailabilityText = (status: string) => {
    switch (status) {
      case 'available': return 'Available Now';
      case 'busy': return 'Currently Busy';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  return (
    <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      {/* Header with Avatar and Status */}
      <div className="relative p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              {!imageError ? (
                <Image
                  src={guide.avatar}
                  alt={`${guide.name} - Local Guide`}
                  width={80}
                  height={80}
                  className="rounded-full object-cover ring-4 ring-orange-100"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl ring-4 ring-orange-100">
                  {guide.name.split(' ').map(n => n[0]).join('')}
                </div>
              )}
              
              {/* Online Status */}
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-white flex items-center justify-center ${getAvailabilityColor(guide.availabilityStatus)}`}>
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>

              {/* Verification Badge */}
              {guide.isVerified && (
                <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-1">
                  <CheckBadgeSolidIcon className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <div className="flex-grow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{guide.name}</h3>
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <MapPinIcon className="w-4 h-4" />
                    <span className="text-sm">{guide.location}</span>
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onLikeToggle(guide.id);
                  }}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
                >
                  {isLiked ? (
                    <HeartSolidIcon className="w-5 h-5 text-red-500" />
                  ) : (
                    <HeartIcon className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>

              {/* Rating and Badges */}
              <div className="flex items-center gap-3 mb-3">
                <StarRating 
                  rating={guide.rating} 
                  showNumber={true} 
                  reviewCount={guide.reviewCount} 
                />
                {guide.isTopRated && (
                  <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-semibold">
                    Top Rated
                  </span>
                )}
              </div>

              {/* Availability Status */}
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${getAvailabilityColor(guide.availabilityStatus)}`}></div>
                <span className="text-gray-600">{getAvailabilityText(guide.availabilityStatus)}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">Responds {guide.responseTime.toLowerCase()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-100">
          <div className="text-center">
            <div className="font-bold text-lg text-gray-900">{guide.experience}</div>
            <div className="text-xs text-gray-600">Years Exp.</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-gray-900">{guide.completedTrips}</div>
            <div className="text-xs text-gray-600">Trips</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-orange-600">₹{guide.hourlyRate}</div>
            <div className="text-xs text-gray-600">per hour</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6">
        {/* Specialties */}
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 mb-2">Specialties</h4>
          <div className="flex flex-wrap gap-2">
            {guide.specialities.slice(0, 3).map((specialty, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
              >
                {specialty}
              </span>
            ))}
            {guide.specialities.length > 3 && (
              <span className="text-xs text-gray-500 px-2 py-1">
                +{guide.specialities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Languages */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <LanguageIcon className="w-4 h-4" />
            <span>Speaks: {guide.languages.join(', ')}</span>
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className={`text-gray-700 text-sm leading-relaxed ${
            showFullDescription ? '' : 'line-clamp-3'
          }`}>
            {guide.description}
          </p>
          {guide.description.length > 150 && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-orange-600 text-sm font-medium mt-1 hover:text-orange-700"
            >
              {showFullDescription ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {/* Expertise Levels */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Expertise</h4>
          <div className="space-y-2">
            <ExpertiseMeter label="spiritual" level={guide.expertise.spiritual} />
            <ExpertiseMeter label="adventure" level={guide.expertise.adventure} />
            <ExpertiseMeter label="cultural" level={guide.expertise.cultural} />
            <ExpertiseMeter label="food" level={guide.expertise.food} />
          </div>
        </div>

        {/* Certifications */}
        {guide.certifications.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <AcademicCapIcon className="w-4 h-4" />
              <span className="font-medium">Certified:</span>
              <span>{guide.certifications[0]}</span>
              {guide.certifications.length > 1 && (
                <span className="text-orange-600">+{guide.certifications.length - 1} more</span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link
            href={`/guides/${guide.id}`}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-semibold text-center transition-colors duration-200 flex items-center justify-center gap-2"
          >
            View Profile
            <ChevronRightIcon className="w-4 h-4" />
          </Link>
          <button
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg transition-colors duration-200 flex items-center gap-2"
            disabled={guide.availabilityStatus === 'offline'}
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4" />
            Chat
          </button>
        </div>
      </div>
    </article>
  );
};

// Main FeaturedGuides Component
const FeaturedGuides: React.FC = () => {
  const [likedGuides, setLikedGuides] = useState<Set<string>>(new Set());
  const [filterSpecialty, setFilterSpecialty] = useState<string>('all');

  const handleLikeToggle = (guideId: string) => {
    setLikedGuides(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(guideId)) {
        newLiked.delete(guideId);
      } else {
        newLiked.add(guideId);
      }
      return newLiked;
    });
  };

  // Get unique specialties for filter
  const specialties = ['all', ...new Set(featuredGuides.flatMap(guide => guide.specialities))];

  // Filter guides based on specialty
  const filteredGuides = filterSpecialty === 'all' 
    ? featuredGuides 
    : featuredGuides.filter(guide => 
        guide.specialities.some(specialty => 
          specialty.toLowerCase().includes(filterSpecialty.toLowerCase())
        )
      );

  // Calculate stats
  const averageRating = featuredGuides.reduce((sum, guide) => sum + guide.rating, 0) / featuredGuides.length;
  const totalExperience = featuredGuides.reduce((sum, guide) => sum + guide.experience, 0);
  const availableGuides = featuredGuides.filter(guide => guide.availabilityStatus === 'available').length;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Expert Local Guides
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Meet Our Certified
            <span className="text-orange-600 block">Local Experts</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Connect with passionate local guides who bring destinations to life with authentic insights, 
            cultural knowledge, and personalized experiences.
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
              <p className="text-sm text-gray-600">Years Combined Experience</p>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <div className="font-bold text-2xl text-green-600 mb-2">
                {availableGuides}
              </div>
              <p className="text-sm text-gray-600">Available Now</p>
            </div>
          </div>

          {/* Specialty Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {specialties.slice(0, 6).map((specialty) => (
              <button
                key={specialty}
                onClick={() => setFilterSpecialty(specialty)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  filterSpecialty === specialty
                    ? 'bg-orange-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {specialty === 'all' ? 'All Guides' : specialty}
              </button>
            ))}
          </div>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {filteredGuides.map((guide) => (
            <GuideCard
              key={guide.id}
              guide={guide}
              isLiked={likedGuides.has(guide.id)}
              onLikeToggle={handleLikeToggle}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredGuides.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No guides found</h3>
            <p className="text-gray-600 mb-6">Try selecting a different specialty</p>
            <button
              onClick={() => setFilterSpecialty('all')}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Show All Guides
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Need a Custom Experience?
            </h3>
            <p className="text-gray-600 mb-6">
              Our guides can create personalized itineraries based on your interests, 
              budget, and time constraints. Get a tailored experience that matches your travel style.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/guides"
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
              >
                Browse All Guides
                <UserGroupIcon className="w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="bg-transparent border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              >
                Request Custom Guide
                <ChatBubbleLeftRightIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedGuides;

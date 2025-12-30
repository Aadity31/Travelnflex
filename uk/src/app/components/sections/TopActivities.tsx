'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  StarIcon, 
  ClockIcon, 
  MapPinIcon, 
  CurrencyRupeeIcon,
  UserGroupIcon,
  FireIcon,
  SparklesIcon,
  HeartIcon,
  PlayCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

// Types
interface TopActivity {
  id: string;
  name: string;
  slug: string;
  type: 'adventure' | 'spiritual' | 'cultural' | 'food' | 'trekking';
  description: string;
  shortDescription: string;
  duration: string;
  location: string;
  price: {
    min: number;
    max: number;
    currency: 'INR';
  };
  difficulty: 'easy' | 'moderate' | 'difficult';
  rating: number;
  reviewCount: number;
  images: string[];
  highlights: string[];
  maxGroupSize: number;
  isPopular: boolean;
  isTrending: boolean;
  discount?: {
    percentage: number;
    validUntil: string;
  };
}

// Mock data
const topActivities: TopActivity[] = [
  {
    id: 'river-rafting',
    name: 'White Water Rafting',
    slug: 'river-rafting-rishikesh',
    type: 'adventure',
    description: 'Navigate the mighty Ganges with Grade I-IV rapids suitable for all skill levels. Professional guides and safety equipment provided.',
    shortDescription: 'Thrilling rapids adventure on the holy Ganges',
    duration: '3-6 hours',
    location: 'Rishikesh',
    price: { min: 999, max: 2499, currency: 'INR' },
    difficulty: 'moderate',
    rating: 4.8,
    reviewCount: 1250,
    images: ['IMG/.png'],
    highlights: ['Professional guides', 'Safety equipment', 'Scenic views', 'All skill levels'],
    maxGroupSize: 12,
    isPopular: true,
    isTrending: false,
    discount: {
      percentage: 20,
      validUntil: '2025-10-15'
    }
  },
  {
    id: 'ganga-aarti',
    name: 'Evening Ganga Aarti',
    slug: 'ganga-aarti-ceremony',
    type: 'spiritual',
    description: 'Witness the divine evening prayer ceremony with floating lamps, chanting, and spiritual energy at sacred ghats.',
    shortDescription: 'Divine prayer ceremony at sacred ghats',
    duration: '1.5 hours',
    location: 'Haridwar & Rishikesh',
    price: { min: 0, max: 599, currency: 'INR' },
    difficulty: 'easy',
    rating: 4.9,
    reviewCount: 2100,
    images: ['https://img.avianexperiences.com/trek/39aa8571-d346-4514-93b8-036bcaae9a64'],
    highlights: ['Sacred ceremony', 'Best viewing spots', 'Cultural insights', 'Photography'],
    maxGroupSize: 50,
    isPopular: true,
    isTrending: true
  },
  {
    id: 'yoga-retreat',
    name: 'Sunrise Yoga Session',
    slug: 'sunrise-yoga-rishikesh',
    type: 'spiritual',
    description: 'Join authentic yoga classes at renowned ashrams with experienced teachers in peaceful Himalayan settings.',
    shortDescription: 'Peaceful yoga with Himalayan sunrise views',
    duration: '2 hours',
    location: 'Rishikesh',
    price: { min: 799, max: 1499, currency: 'INR' },
    difficulty: 'easy',
    rating: 4.7,
    reviewCount: 850,
    images: ['https://www.chardham-tours.com/wp-content/uploads/2020/01/yoga.jpg'],
    highlights: ['Certified instructors', 'Sunrise views', 'All levels welcome', 'Equipment provided'],
    maxGroupSize: 20,
    isPopular: false,
    isTrending: true
  },
  {
    id: 'bungee-jumping',
    name: 'Bungee Jumping',
    slug: 'bungee-jumping-rishikesh',
    type: 'adventure',
    description: 'Experience India\'s highest bungee jump from 83 meters with certified New Zealand technology and safety standards.',
    shortDescription: 'India\'s highest bungee jump experience',
    duration: '1 hour',
    location: 'Rishikesh',
    price: { min: 3999, max: 3999, currency: 'INR' },
    difficulty: 'difficult',
    rating: 4.6,
    reviewCount: 650,
    images: ['https://www.jumpinheights.com/wp-content/uploads/2025/08/bungee-jumping-in-india-1024x683.webp', 'https://www.indianholiday.com/wordpress/wp-content/uploads/2016/05/roopkund-trek.jpg'],
    highlights: ['83m height', 'NZ technology', 'Video recording', 'Certificate'],
    maxGroupSize: 1,
    isPopular: false,
    isTrending: false
  },
  {
    id: 'temple-tour',
    name: 'Ancient Temples Tour',
    slug: 'ancient-temples-haridwar',
    type: 'cultural',
    description: 'Explore centuries-old temples with rich history and spiritual significance, guided by knowledgeable local experts.',
    shortDescription: 'Sacred temples with rich spiritual heritage',
    duration: '4 hours',
    location: 'Haridwar',
    price: { min: 1299, max: 1999, currency: 'INR' },
    difficulty: 'easy',
    rating: 4.5,
    reviewCount: 420,
    images: [
    'https://www.chardhamtour.in/blog/wp-content/uploads/2017/08/Badrinath.jpg',
    'https://www.pilgrimagetour.in/blog/wp-content/uploads/2023/09/Kedarnath-Temple.jpg'
  ],
    highlights: ['Ancient architecture', 'Spiritual stories', 'Local guide', 'Photography'],
    maxGroupSize: 15,
    isPopular: false,
    isTrending: false
  },
  {
    id: 'himalayan-trek',
    name: 'Himalayan Nature Trek',
    slug: 'himalayan-trek-rishikesh',
    type: 'trekking',
    description: 'Discover hidden waterfalls and pristine nature trails in the foothills of the mighty Himalayas.',
    shortDescription: 'Scenic trek to hidden waterfalls',
    duration: '5 hours',
    location: 'Rishikesh',
    price: { min: 1799, max: 2499, currency: 'INR' },
    difficulty: 'moderate',
    rating: 4.4,
    reviewCount: 320,
    images: ['https://lh3.googleusercontent.com/RTgkvYUiqynDKPVJjqk-DxXl-u_gIHxevP_lQ9ED0hyqY08dmm5A9PSj19k-qRxYetGtSkrCj_CmCreIVmb2qz2SlEHqVue-chjRNOJOmaELEbW54OMeer2Y_IIrcNLwZazDGU7wMir_2llokfA6FJI', 'https://www.indianholiday.com/wordpress/wp-content/uploads/2016/05/roopkund-trek.jpg'],
    highlights: ['Waterfall views', 'Nature trails', 'Bird watching', 'Packed lunch'],
    maxGroupSize: 10,
    isPopular: false,
    isTrending: true
  }
];

const activityTypes = [
  { value: 'all', label: 'All Activities', icon: SparklesIcon },
  { value: 'adventure', label: 'Adventure', icon: FireIcon },
  { value: 'spiritual', label: 'Spiritual', icon: HeartIcon },
  { value: 'cultural', label: 'Cultural', icon: StarIcon },
  { value: 'trekking', label: 'Trekking', icon: MapPinIcon }
];

// Activity Card Component
interface ActivityCardProps {
  activity: TopActivity;
  isLiked: boolean;
  onLikeToggle: (activityId: string) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ 
  activity, 
  isLiked, 
  onLikeToggle 
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'difficult': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'adventure': return 'bg-red-500';
      case 'spiritual': return 'bg-purple-500';
      case 'cultural': return 'bg-blue-500';
      case 'trekking': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === activity.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? activity.images.length - 1 : prev - 1
    );
  };

  return (
    <article className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={activity.images[currentImageIndex]}
          alt={`${activity.name} - ${activity.shortDescription}`}
          fill
          className={`object-cover group-hover:scale-110 transition-transform duration-700 ${
            imageLoading ? 'blur-sm' : 'blur-0'
          }`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onLoad={() => setImageLoading(false)}
        />

        {/* Loading overlay */}
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-400">Loading...</div>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Image Navigation */}
        {activity.images.length > 1 && (
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={prevImage}
              className="bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
              aria-label="Next image"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Top badges and controls */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${getTypeColor(activity.type)}`}>
              {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
            </span>
            {activity.isPopular && (
              <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <FireIcon className="w-3 h-3" />
                Popular
              </span>
            )}
            {activity.isTrending && (
              <span className="bg-pink-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                <SparklesIcon className="w-3 h-3" />
                Trending
              </span>
            )}
          </div>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              onLikeToggle(activity.id);
            }}
            className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors duration-200"
            aria-label={isLiked ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isLiked ? (
              <HeartSolidIcon className="w-5 h-5 text-red-500" />
            ) : (
              <HeartIcon className="w-5 h-5 text-gray-600 hover:text-red-500" />
            )}
          </button>
        </div>

        {/* Discount Badge */}
        {activity.discount && (
          <div className="absolute bottom-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            {activity.discount.percentage}% OFF
          </div>
        )}

        {/* Rating */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
          <StarSolidIcon className="w-4 h-4 text-yellow-400" />
          <span className="font-semibold text-sm">{activity.rating}</span>
          <span className="text-xs text-gray-600">({activity.reviewCount})</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Location and Duration */}
        <div className="flex items-center justify-between mb-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MapPinIcon className="w-4 h-4" />
            <span>{activity.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <ClockIcon className="w-4 h-4" />
            <span>{activity.duration}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors duration-300">
          {activity.name}
        </h3>

        {/* Description */}
        <p className="text-gray-700 mb-4 text-sm line-clamp-2 leading-relaxed">
          {activity.shortDescription}
        </p>

        {/* Highlights */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {activity.highlights.slice(0, 3).map((highlight, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
              >
                {highlight}
              </span>
            ))}
            {activity.highlights.length > 3 && (
              <span className="text-xs text-gray-500 px-2 py-1">
                +{activity.highlights.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Details Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <UserGroupIcon className="w-4 h-4" />
              <span>Max {activity.maxGroupSize}</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(activity.difficulty)}`}>
              {activity.difficulty.charAt(0).toUpperCase() + activity.difficulty.slice(1)}
            </span>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <CurrencyRupeeIcon className="w-5 h-5 text-gray-900" />
            <div>
              {activity.price.min === activity.price.max ? (
                <span className="text-2xl font-bold text-gray-900">
                  {activity.price.min.toLocaleString('en-IN')}
                </span>
              ) : (
                <span className="text-lg font-bold text-gray-900">
                  {activity.price.min.toLocaleString('en-IN')} - {activity.price.max.toLocaleString('en-IN')}
                </span>
              )}
              {activity.discount && (
                <div className="text-xs text-gray-500 line-through">
                  ₹{Math.round(activity.price.min / (1 - activity.discount.percentage / 100)).toLocaleString('en-IN')}
                </div>
              )}
            </div>
          </div>

          <Link
            href={`/activities/${activity.slug}`}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
          >
            Book Now
            <PlayCircleIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
};

// Main TopActivities Component
const TopActivities: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [likedActivities, setLikedActivities] = useState<Set<string>>(new Set());

  const filteredActivities = useMemo(() => {
    if (activeFilter === 'all') {
      return topActivities;
    }
    return topActivities.filter(activity => activity.type === activeFilter);
  }, [activeFilter]);

  const handleLikeToggle = (activityId: string) => {
    setLikedActivities(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(activityId)) {
        newLiked.delete(activityId);
      } else {
        newLiked.add(activityId);
      }
      return newLiked;
    });
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Top Experiences
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Adventure & Spiritual
            <span className="text-orange-600 block">Activities</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover a perfect blend of thrilling adventures and soul-enriching spiritual experiences 
            in the sacred lands of Rishikesh and Haridwar.
          </p>
        </div>

        {/* Activity Type Filters */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          {activityTypes.map((type) => {
            const IconComponent = type.icon;
            const isActive = activeFilter === type.value;
            
            return (
              <button
                key={type.value}
                onClick={() => setActiveFilter(type.value)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-orange-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                {type.label}
                {type.value !== 'all' && (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    isActive ? 'bg-white/20' : 'bg-gray-200'
                  }`}>
                    {topActivities.filter(a => a.type === type.value).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredActivities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              isLiked={likedActivities.has(activity.id)}
              onLikeToggle={handleLikeToggle}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No activities found</h3>
            <p className="text-gray-600 mb-6">Try selecting a different category</p>
            <button
              onClick={() => setActiveFilter('all')}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Show All Activities
            </button>
          </div>
        )}

        {/* View All CTA */}
        <div className="text-center">
          <Link
            href="/activities"
            className="inline-flex items-center gap-3 bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-orange-700 transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            Explore All Activities
            <SparklesIcon className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopActivities;

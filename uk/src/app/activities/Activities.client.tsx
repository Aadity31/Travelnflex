'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { StarIcon, ClockIcon, MapPinIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';
import type { Activity, SearchFilters } from '@/app/types';

const activityTypes = [
  { value: '', label: 'All Activities' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'spiritual', label: 'Spiritual' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'trekking', label: 'Trekking' }
];

const difficultyLevels = [
  { value: '', label: 'All Levels' },
  { value: 'easy', label: 'Easy' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'difficult', label: 'Difficult' }
];

export default function ActivitiesClient({
  initialActivities,
}: {
  initialActivities: Activity[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [cursor, setCursor] = useState<string | null>(() => {
  const last = initialActivities.at(-1);
  return last ? new Date(last.createdAt).toISOString() : null;
});



  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      if (filters.activityType && activity.type !== filters.activityType) return false;
      if (filters.difficulty && activity.difficulty !== filters.difficulty) return false;
      if (filters.location && !activity.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.priceRange) {
        const [min, max] = filters.priceRange;
        if (activity.price.min > max || activity.price.max < min) return false;
      }
      if (filters.rating && activity.rating < filters.rating) return false;
      return true;
    });
  }, [filters, activities]);

  // safer updateFilter to satisfy TS when merging partials into SearchFilters
  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters(prev => ({ ...(prev as object), [key]: value } as SearchFilters));
  };
//infinite scroll effect

  useEffect(() => {
  if (!loaderRef.current || !hasMore) return;

  const observer = new IntersectionObserver(
    async ([entry]) => {
      if (!entry.isIntersecting || isLoading) return;

      setIsLoading(true);

      try {
        const url = cursor
          ? `/api/activities?cursor=${encodeURIComponent(cursor)}`
          : `/api/activities`;

        const res = await fetch(url);
        if (!res.ok) throw new Error('API failed');

        const next: Activity[] = await res.json();

        if (next.length === 0) {
          setHasMore(false);
          return;
        }
const last = next.at(-1);
        setActivities(prev => [...prev, ...next]);
        setCursor(last ? new Date(last.createdAt).toISOString() : null); // ✅ SAFE
      } catch (err) {
        console.error('Infinite scroll failed:', err);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    },
    {
      rootMargin: '200px', // preload before bottom
    }
  );

  observer.observe(loaderRef.current);

  return () => observer.disconnect();
}, [cursor, hasMore, isLoading]);




  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-64 bg-gradient-to-r from-green-600 to-blue-600 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Adventure & Spiritual Activities</h1>
          <p className="text-xl max-w-2xl mx-auto px-4">
            Discover a perfect blend of thrilling adventures and soul-enriching spiritual experiences
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredActivities.length} Activities Found
            </h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:flex items-center gap-4 flex-wrap">
            <select
              value={filters.activityType || ''}
              onChange={(e) => updateFilter('activityType', (e.target.value as SearchFilters['activityType']) || undefined)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              {activityTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>

            <select
              value={filters.difficulty || ''}
              onChange={(e) => updateFilter('difficulty', (e.target.value as SearchFilters['difficulty']) || undefined)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              {difficultyLevels.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Location..."
              value={filters.location || ''}
              onChange={(e) => updateFilter('location', (e.target.value as SearchFilters['location']) || undefined)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />

            <select
              value={filters.rating?.toString() ?? ''}
              onChange={(e) => updateFilter('rating', e.target.value ? Number(e.target.value) : undefined)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">All Ratings</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.0">4.0+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
            </select>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden bg-white border border-gray-300 rounded-lg p-4 space-y-4">
              <select
                value={filters.activityType || ''}
                onChange={(e) => updateFilter('activityType', (e.target.value as SearchFilters['activityType']) || undefined)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                {activityTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              {/* Add other mobile filters */}
            </div>
          )}
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <article
              key={activity.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-48">
                <Image
                  src={activity.images[0]}
                  alt={activity.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${activity.type === 'adventure' ? 'bg-red-500' :
                    activity.type === 'spiritual' ? 'bg-purple-500' :
                      activity.type === 'cultural' ? 'bg-blue-500' :
                        'bg-green-500'
                    }`}>
                    {activity.type ? activity.type.charAt(0).toUpperCase() + activity.type.slice(1) : ''}
                  </span>
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                  <StarIcon className="w-4 h-4 text-yellow-400" />
                  <span className="font-semibold text-sm">{activity.rating}</span>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <MapPinIcon className="w-4 h-4" />
                  <span className="text-sm">{activity.location}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {activity.name}
                </h3>

                <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                  {activity.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ClockIcon className="w-4 h-4" />
                    {activity.duration}
                  </div>
                  <div className="flex items-center gap-1 text-lg font-bold text-orange-600">
                    <span className="text-base">₹</span>
                    {activity.price.min === activity.price.max
                      ? activity.price.min
                      : `${activity.price.min} - ${activity.price.max}`}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-xs text-gray-600 mb-2">Includes:</div>
                  <div className="flex flex-wrap gap-1">
                    {activity.includes.slice(0, 2).map((item, index) => (
                      <span key={index} className="bg-gray-100 text-xs px-2 py-1 rounded-full">
                        {item}
                      </span>
                    ))}
                    {activity.includes.length > 2 && (
                      <span className="text-xs text-gray-500">+{activity.includes.length - 2} more</span>
                    )}
                  </div>
                </div>

                <Link
                  href={`/activities/${activity.slug}`}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200 text-center block"
                >
                  Book Activity
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div ref={loaderRef} className="h-10" />
        {isLoading && (
          <div className="text-center py-6 text-gray-500">
            Loading more activities…
          </div>
        )}

        {/* No Results */}
        {filteredActivities.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No activities found</h3>
            <p className="text-gray-600 mb-8">Try adjusting your filters to see more results</p>
            <button
              onClick={() => setFilters({})}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
import { MapPinIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

interface MapSectionProps {
  name: string;
  locations?: string[];
}

export default function MapSection({ name, locations = [] }: MapSectionProps) {
  // Default Char Dham locations if no locations provided
  const defaultLocations = ["Haridwar", "Barkot", "Yamunotri", "Uttarkashi", "Gangotri", "Guptkashi", "Kedarnath", "Badrinath"];
  
  // Use provided locations or fallback to defaults
  const routeLocations = locations.length > 0 
    ? [...new Set(locations)] // Remove duplicates
    : defaultLocations;

  const startLocation = routeLocations[0];
  const endLocation = routeLocations[routeLocations.length - 1];
  const viaLocations = routeLocations.slice(1, -1).filter(Boolean);

  // Generate dynamic Google Maps embed URL based on itinerary locations
  const generateMapEmbedUrl = () => {
    if (routeLocations.length === 0) {
      return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7288312.431357893!2d71.5!3d26.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db6c02b2c7f85%3A0x68fcfd0dbbc15e3!2sRajasthan!5e0!3m2!1sen!2sin!4v1707477600000!5m2!1sen!2sin";
    }

    // For Char Dham or multiple locations, create a route map
    const baseUrl = "https://www.google.com/maps/embed/v1/directions";
    const origin = encodeURIComponent(startLocation);
    const destination = encodeURIComponent(endLocation);
    const waypoints = viaLocations.length > 0 
      ? `&waypoints=${viaLocations.map(encodeURIComponent).join('|')}` 
      : '';
    const key = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with actual API key or use without key for limited requests
    
    // Fallback: Use a region-based embed that shows the route area
    const centerLat = 30.0; // Approximate center for Uttarakhand
    const centerLng = 79.0;
    
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3487.5!2d${centerLng}!3d${centerLat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s${encodeURIComponent(name)}!5e0!3m2!1sen!2sin!4v1707477600000!5m2!1sen!2sin`;
  };

  const fullMapUrl = `https://www.google.com/maps/dir/${startLocation}/${viaLocations.join('/')}/${endLocation}`;

  // Calculate route stats
  const totalDistance = routeLocations.length > 1 ? "~400 km" : "~50 km";
  const totalCities = `${routeLocations.length} destinations`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MapPinIcon className="w-5 h-5 text-orange-500 shrink-0" />
          <h3 className="font-bold text-gray-900 text-sm sm:text-base">
            Route Map: {name}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 font-medium">
            {routeLocations.length} Destinations
          </span>
          <a
            href={fullMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-semibold text-orange-500 hover:text-orange-600 hover:underline transition-colors"
          >
            <span>View in Maps</span>
            <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Map container */}
      <div className="w-full aspect-video bg-gray-100 relative">
        <iframe
          src={generateMapEmbedUrl()}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="Route Map"
          className="opacity-95"
        />

        {/* Route info overlay - compact and responsive */}
        <div className="absolute bottom-14 left-1 right-2 sm:left-2 sm:right-auto sm:max-w-[140px] lg:max-w-[160px] bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 overflow-hidden z-10">
          <div className="p-2 sm:p-2.5">
            {/* Route endpoints */}
            <div className="space-y-1.5 mb-2">
              {/* Start */}
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 shrink-0"></span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Start</span>
                <span className="text-xs font-bold text-gray-900 truncate">{startLocation}</span>
              </div>

              {/* Via */}
              {viaLocations.length > 0 && (
                <div className="flex items-center gap-1.5 pl-0.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Via</span>
                  <span className="text-[10px] text-gray-700 truncate">{viaLocations.join(', ')}</span>
                </div>
              )}

              {/* End */}
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">End</span>
                <span className="text-xs font-bold text-gray-900 truncate">{endLocation}</span>
              </div>
            </div>

            {/* Route stats */}
            <div className="flex items-center gap-2 pt-1.5 border-t border-gray-100">
              <span className="text-[10px] text-gray-600 font-medium">{totalDistance}</span>
              <span className="text-[10px] text-gray-400">•</span>
              <span className="text-[10px] text-gray-600 font-medium">{totalCities}</span>
            </div>
          </div>
        </div>

        {/* Route highlights badges - top right */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
          <div className="bg-purple-500/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-full shadow text-[10px] font-semibold flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span>Spiritual Journey</span>
          </div>
          <div className="bg-orange-500/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-full shadow text-[10px] font-semibold flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span>Char Dham</span>
          </div>
        </div>
      </div>
    </div>
  );
}

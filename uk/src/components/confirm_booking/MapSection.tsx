import { MapPinIcon } from "@heroicons/react/24/outline";

export default function MapSection({ name }: { name: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <MapPinIcon className="w-5 h-5 text-orange-500" />
          Route Map: {name}
        </h3>
        <span className="text-xs text-gray-500">
          10 Days / 9 Nights
        </span>
      </div>
      <div className="w-full aspect-video bg-gray-100 relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.257002476564!2d78.1642!3d30.0869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3909dcc202279c09%3A0x7c43b63689cc005!2sRishikesh%2C%20Uttarakhand!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          className="grayscale-[20%] opacity-80"
        />
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg border border-gray-200 max-w-xs hidden sm:block">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-xs font-bold text-gray-500 uppercase">
              Start
            </span>
            <span className="text-sm font-bold">Haridwar</span>
          </div>
          <div className="h-4 border-l-2 border-dashed border-gray-300 ml-[3px] my-0.5"></div>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="text-xs font-bold text-gray-500 uppercase">
              End
            </span>
            <span className="text-sm font-bold">Badrinath</span>
          </div>
        </div>
      </div>
    </div>
  );
}

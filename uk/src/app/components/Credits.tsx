import Link from "next/link";

interface CreditsProps {
  designerName?: string;
  designerUrl?: string;
  showLicense?: boolean;
  licenseNumber?: string;
  className?: string;
}

export default function Credits({
  designerName = "APS-Group.dev",
  designerUrl = "https://yourwebsite.com",
  className = "",
}: CreditsProps) {
  const currentYear = new Date().getFullYear();

  return (
    <div className={`border-t border-gray-800 bg-gray-950 ${className}`}>
      <div className="max-w-7xl mx-auto px-3 py-3">
        {/* FORCE SINGLE ROW */}
        <div className="flex flex-row items-center justify-between gap-2  text-[10px] md:text-xs text-gray-400 whitespace-nowrap">
          
          {/* Left */}
          <div>
            © {currentYear} Sacred Journey
          </div>

          {/* Right */}
          <div>
            Designed by{" "}
            <Link
              href={designerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
            >
              {designerName}
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

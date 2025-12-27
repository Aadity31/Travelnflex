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
  showLicense = true,
  // licenseNumber = "TL-UK-2024-XXXX",
  className = "",
}: CreditsProps) {
  const currentYear = new Date().getFullYear();

  return (
    <div className={`border-t border-gray-800 bg-gray-950 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          {/* Left - Copyright */}
          <div className="text-center md:text-left">
            <p>© {currentYear} Sacred Journey. All rights reserved.</p>
          </div>

          {/* Center - License (Optional) */}
          {/* {showLicense && (
            <div className="hidden md:block">
              <p>Tourism License: {licenseNumber}</p>
            </div>
          )} */}

          {/* Right - Credits */}
          <div className="text-center md:text-right">
            <p>
              Designed & Developed by{" "}
              <Link
                href={designerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-300 font-semibold transition-colors"
              >
                {designerName}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

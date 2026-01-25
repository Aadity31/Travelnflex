import Link from "next/link";
import { Heart } from "lucide-react";

interface CreditsProps {
  designerName?: string;
  designerUrl?: string;
  showLicense?: boolean;
  licenseNumber?: string;
  className?: string;
}

export default function Credits({
  designerName = "APS-Groups",
  designerUrl = "https://www.apsgroupco.com",
  className = "",
}: CreditsProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`border-t border-gray-800 bg-gray-950 ${className}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6">
        {/* Optional Footer Links */}
        {/* <div className="hidden sm:flex items-center justify-center gap-4 md:gap-6 py-3 sm:py-4 border-b border-gray-800/50">
          <Link
            href="/privacy"
            className="text-[10px] md:text-xs text-gray-400 hover:text-orange-400 transition-colors"
          >
            Privacy Policy
          </Link>
          <span className="text-gray-700">•</span>
          <Link
            href="/terms"
            className="text-[10px] md:text-xs text-gray-400 hover:text-orange-400 transition-colors"
          >
            Terms of Service
          </Link>
          <span className="text-gray-700">•</span>
          <Link
            href="/contact"
            className="text-[10px] md:text-xs text-gray-400 hover:text-orange-400 transition-colors"
          >
            Contact Us
          </Link>
        </div> */}

        {/* Credits Section */}
        <div className="py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2 sm:gap-3">
            {/* Left - Copyright */}
            <div className="text-[9px] sm:text-[10px] md:text-xs text-gray-400 order-2 sm:order-1 text-center sm:text-left">
              <span className="inline-block">
                © {currentYear} Sacred Journey. All rights reserved.
              </span>
            </div>

            {/* Center - Separator (Hidden on mobile) */}
            <div className="hidden lg:block text-gray-700 order-2">•</div>

            {/* Right - Designer Credit */}
            <div className="text-[9px] sm:text-[10px] md:text-xs text-gray-400 order-1 sm:order-3 text-center sm:text-right">
              <span className="inline-flex items-center gap-1 flex-wrap justify-center sm:justify-end">
                <span>Designed by</span>
                <Link
                  href={designerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 font-bold transition-all duration-300 underline-offset-2 hover:underline hover:scale-105 inline-block"
                >
                  {designerName}
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

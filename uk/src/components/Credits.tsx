import Link from "next/link";

interface CreditsProps {
  companyEmail?: string;
  websiteName?: string;
  designerName?: string;
  designerUrl?: string;
  className?: string;
  /** Variant determines the color scheme: 'footer' for dark colors (when with Footer), 'standalone' for light colors (without Footer) */
  variant?: "footer" | "standalone";
}

export default function Credits({
  websiteName = "TravelnFlex",
  designerName = "APS-Groups",
  designerUrl = "https://www.apsgroupco.com",
  className = "",
  variant = "standalone",
}: CreditsProps) {
  const currentYear = new Date().getFullYear();

  // Determine styles based on variant
  const isFooterVariant = variant === "footer";
  const bgColor = isFooterVariant ? "bg-neutral-darker" : "bg-transparent";
  const textColor = isFooterVariant ? "text-(--text-muted-on-dark)" : "!text-foreground-secondary";
  const borderColor = isFooterVariant ? "border-primary" : "border-border-light";

  return (
    <div
      className={`${bgColor} border-t ${borderColor} ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Credits Section */}
        <div className="py-4">
          {/* Mobile: Single row */}
          <div className="flex flex-row items-center justify-between gap-2 sm:hidden">
            {/* Left - Site Name */}
            <div className={`${textColor} text-sm`}>
              <p className="text-primary hover:text-primary-light transition-colors duration-300">
                travelnflex.com
              </p>
            </div>

            {/* Center - Copyright */}
            <div className={`${textColor} text-xs`}>
              <span>© {currentYear} <span className="font-medium text-primary">{websiteName}</span></span>
            </div>

            {/* Right - Designer Credit */}
            <div className={`${textColor} text-xs`}>
              <Link
                href={designerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-light font-medium 
                         transition-all duration-300 inline-flex items-center gap-1"
              >
                {designerName}
                <svg
                  className="w-3 h-3 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Desktop: 3-column layout */}
          <div className="hidden sm:flex flex-row items-center justify-between gap-4">
            {/* Left - Site Name */}
            <div className={`${textColor} text-sm`}>
              <p className="text-primary hover:text-primary-light transition-colors duration-300">
                travelnflex.com
              </p>
            </div>

            {/* Center - Copyright */}
            <div className={`${textColor} text-sm`}>
              <span>© {currentYear} All rights reserved by <span className="font-medium text-primary">{websiteName}</span></span>
            </div>

            {/* Right - Designer Credit */}
            <div className={`${textColor} text-sm`}>
              <Link
                href={designerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-light font-medium 
                         transition-all duration-300 inline-flex items-center gap-1
                         hover:underline hover:underline-offset-4"
              >
                Designed by {designerName}
                <svg
                  className="w-3 h-3 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

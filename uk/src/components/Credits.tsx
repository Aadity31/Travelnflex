import Link from "next/link";

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
    <footer
      className={`border-t border-[var(--border-medium)] bg-[var(--color-neutral-darker)] ${className}`}
    >
      <div className="max-w-8xl mx-auto px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        {/* Credits Section */}
        <div className="py-2 sm:py-2 md:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2 sm:gap-3">
            {/* Left - Copyright */}
            <div className="text-[0.625rem] sm:text-xs md:text-sm lg:text-md text-[var(--foreground-muted)] order-2 sm:order-1 text-center sm:text-left leading-relaxed">
              <span className="inline-block">
                © {currentYear} Sacred Journey. All rights reserved.
              </span>
            </div>

            {/* Center - Separator (Hidden on mobile) */}
            <div
              className="hidden lg:block text-[var(--color-neutral)] text-sm order-2"
              aria-hidden="true"
            >
              •
            </div>

            {/* Right - Designer Credit */}
            <div className="text-[0.625rem] sm:text-xs md:text-sm lg:text-md text-[var(--foreground-muted)] order-1 sm:order-3 text-center sm:text-right leading-relaxed">
              <span className="inline-flex items-center gap-1 flex-wrap justify-center sm:justify-end">
                <span>Designed by</span>

                <Link
                  href={designerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] font-bold transition-all duration-300 underline-offset-2 hover:underline hover:scale-105 inline-block"
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

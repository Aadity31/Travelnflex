import Link from "next/link";
import Image from "next/image";

export default function FooterWithCredits() {
  const socialLinks = [
    {
      name: "Facebook",
      icon: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
      href: "https://www.facebook.com/siddhu.thapa.35",
      type: "stroke" as const,
    },
    {
      name: "Instagram",
      icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
      href: "https://www.instagram.com/adityadimriaadi",
      type: "fill" as const,
    },
    {
      name: "X",
      icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
      href: "https://x.com/AadiDimri",
      type: "fill" as const,
    },
  ];

  const quickLinks = [
    { name: "Destinations", href: "/destinations" },
    { name: "About Us", href: "/about-us" },
    { name: "Contact", href: "/contact" },
    { name: "Blog", href: "/blog" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms & Conditions", href: "/terms-and-conditions" },
    { name: "Refund Policy", href: "/refund-policy" },
  ];

  return (
    <footer className="bg-[var(--color-neutral-darker)] text-[var(--text-on-dark)]">
      {/* Decorative gradient top border */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600" />

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10 lg:py-14">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand Section */}
          <div className="col-span-1 lg:col-span-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <Image
                  src="/logo.svg"
                  alt="TravelnFlex"
                  className="h-9 w-auto object-contain"
                  width={126}
                  height={36}
                  priority
                />
              </div>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-sm">
              Your trusted guide to spiritual destinations across India. Explore
              sacred places with ease and create unforgettable journeys.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-[var(--color-neutral-dark)] rounded-lg flex items-center justify-center 
                           hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 
                           transition-all duration-300 ease-out
                           hover:shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5
                           group border border-gray-700 hover:border-orange-500"
                  aria-label={social.name}
                >
                  {social.type === "stroke" ? (
                    <svg
                      className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={social.icon}
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d={social.icon} />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links & Legal */}
          <div className="col-span-1 lg:col-span-8">
            <div className="grid grid-cols-2 gap-6 md:gap-8">
              {/* Quick Links */}
              <div>
                <h3 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-gradient-to-b from-orange-500 to-orange-400 rounded-full" />
                  Quick Links
                </h3>
                <ul className="space-y-2.5">
                  {quickLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-orange-400 transition-all duration-300 
                                 inline-flex items-center gap-2 group text-sm"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-orange-500 
                                         transition-all duration-300 group-hover:scale-150" />
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          {link.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-gradient-to-b from-orange-500 to-orange-400 rounded-full" />
                  Legal
                </h3>
                <ul className="space-y-2.5">
                  {legalLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-orange-400 transition-all duration-300 
                                 inline-flex items-center gap-2 group text-sm"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-orange-500 
                                         transition-all duration-300 group-hover:scale-150" />
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          {link.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Need Help Section - Centered */}
      
          <div className="flex justify-center">
  <div className="flex items-center mr-[920] mt-2 gap-2 text-sm text-white font-medium ml-6">
    <span>Need Help?</span>
    <a
      href="mailto:info@travelnflex.com"
      className="text-orange-400 hover:text-orange-300 transition-colors duration-300"
    >
      info@travelnflex.com
    </a>
  </div>
</div>

      
      </div>
    </footer>
  );
}

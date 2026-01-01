/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        pathname: "/**", // Explicit pathname wildcard
      },
      {
        protocol: "https",
        hostname: "**",
        pathname: "**/.*/**", // Handles paths with dots
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;

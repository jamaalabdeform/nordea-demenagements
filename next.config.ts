import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  async rewrites() {
    // URLs SEO locales « /demenagement-lille » servies par la route /demenagement/[ville]
    return [{ source: "/demenagement-:ville", destination: "/demenagement/:ville" }];
  },
};

export default nextConfig;

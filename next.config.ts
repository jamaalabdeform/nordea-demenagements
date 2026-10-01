import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Build autonome (node .next/standalone/server.js) : hébergement sur VPS OVH ou tout serveur Node
  output: "standalone",
  images: { formats: ["image/avif", "image/webp"] },
  async rewrites() {
    // URLs SEO locales « /demenagement-lille » servies par la route /demenagement/[ville]
    return [{ source: "/demenagement-:ville", destination: "/demenagement/:ville" }];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed output: "export" to support dynamic routes in compliance dashboard
  // Static export is not compatible with dynamic routes and authentication
  images: {
    formats: ["image/avif", "image/webp"],
  },
  compress: true,
};

export default nextConfig;

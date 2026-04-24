import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    formats: ["image/avif", "image/webp"],
    unoptimized: true, // required for static export (no image server)
  },
  compress: true,
};

export default nextConfig;

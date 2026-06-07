import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify automatically handles Next.js deployment
  // No need for 'output' configuration
  
  images: {
    formats: ["image/avif", "image/webp"],
  },
  
  compress: true,
  
  // Recommended for production
  poweredByHeader: false,
};

export default nextConfig;
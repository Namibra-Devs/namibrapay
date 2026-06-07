import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Netlify automatically handles Next.js deployment
  
  images: {
    // Netlify doesn't support Next.js Image Optimization on free tier
    // Use unoptimized images or upgrade to paid plan
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
  },
  
  compress: true,
  
  // Recommended for production
  poweredByHeader: false,
};

export default nextConfig;
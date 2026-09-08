import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
  },
  
  compress: true,
  
  // Recommended for production
  poweredByHeader: false,
  
  // Ensure Next.js resolves .tsx files for component imports
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  
  // Empty turbopack config to acknowledge we're using it in dev mode
  turbopack: {},
  
  // Configure webpack for production builds (when --webpack flag is used)
  webpack: (config, { isServer }) => {
    // Ensure proper extension resolution order
    config.resolve.extensions = [
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.json',
    ];
    
    return config;
  },
};

export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
  },
  
  compress: true,
  
  // Recommended for production
  poweredByHeader: false,
  
  // Configure webpack to resolve .tsx files without needing index files
  webpack: (config) => {
    config.resolve.extensions = ['.tsx', '.ts', '.jsx', '.js', '.json'];
    config.resolve.extensionAlias = {
      '.js': ['.tsx', '.ts', '.jsx', '.js'],
      '.jsx': ['.tsx', '.jsx'],
      '.ts': ['.tsx', '.ts'],
    };
    return config;
  },
};

export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
  },
  
  compress: true,
  
  // Recommended for production
  poweredByHeader: false,
  
  // Turbopack experimental config for module resolution
  experimental: {
    turbo: {
      resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    },
  },
  
  // Configure webpack to resolve .tsx files without needing index files
  webpack: (config, { isServer }) => {
    // Ensure webpack resolves .tsx files for imports without extensions
    config.resolve.extensions = ['.tsx', '.ts', '.jsx', '.js', '.json', '.mjs'];
    
    // Allow importing .tsx files via .js extension
    config.resolve.extensionAlias = {
      '.js': ['.tsx', '.ts', '.jsx', '.js'],
      '.jsx': ['.tsx', '.jsx'],
      '.ts': ['.tsx', '.ts'],
    };
    
    return config;
  },
};

export default nextConfig;
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
  
  // Configure webpack to properly resolve modules
  webpack: (config, { isServer }) => {
    // Add module resolution rules
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      'node_modules',
    ];
    
    // Ensure proper extension resolution order
    config.resolve.extensions = [
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.json',
      '.mjs',
    ];
    
    // Allow .tsx files to be resolved without extension
    config.resolve.extensionAlias = {
      '.js': ['.tsx', '.ts', '.jsx', '.js'],
      '.mjs': ['.mts', '.mjs'],
    };
    
    return config;
  },
};

export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  
  // Exclude test files from being treated as pages
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  webpack: (config, { isServer }) => {
    // Ignore test files and __tests__ directories
    config.plugins.push(
      new (require('webpack')).IgnorePlugin({
        resourceRegExp: /\/(test|spec|__tests__)\//
      })
    );
    
    return config;
  }
};

export default nextConfig;

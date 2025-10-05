import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Remove outputFileTracingRoot for Vercel deployment
  // outputFileTracingRoot: "/Users/s2500141/Documents/bc_studies/cms/nextjs_portfolio"
  
  // Configure Turbopack for better Vercel compatibility
  experimental: {
    turbo: {
      // Let Vercel handle the root directory detection
    }
  }
};

export default nextConfig;

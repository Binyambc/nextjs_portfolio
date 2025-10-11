import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Remove outputFileTracingRoot for Vercel deployment
  // outputFileTracingRoot: "/Users/s2500141/Documents/bc_studies/cms/nextjs_portfolio"
  
  // Configure Turbopack for better Vercel compatibility (updated syntax)
  turbopack: {
    // Let Vercel handle the root directory detection
  },
  
  // Configure external images for Drupal CMS
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'drupalportfolio.lndo.site',
        port: '',
        pathname: '/sites/default/files/**',
      },
      {
        protocol: 'https',
        hostname: 'drupalportfolio.lndo.site',
        port: '',
        pathname: '/sites/default/files/**',
      },
      // Add other Drupal hostnames if needed
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/sites/default/files/**',
      }
    ],
  },
};

export default nextConfig;

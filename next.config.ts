import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    // Remove unrecognized keys to prevent errors
    // allowedDevOrigins is not a valid Next.js config option

    // Required for Inter font variable
    // optimizeFonts: true, // Remove if it causes issues
  },
};

export default nextConfig;
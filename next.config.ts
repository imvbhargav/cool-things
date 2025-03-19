import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.icons8.com',   // Allow images from Icons8
      },
      {
        protocol: 'https',
        hostname: 'loremflickr.com',  // Allow images from LoremFlickr
      },
      {
        protocol: 'https',
        hostname: '**',    // Allow images from PicSumPhotos
      }
    ],
  },
};

export default nextConfig;

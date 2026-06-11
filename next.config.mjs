/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['https://theocratically-subscribable-justin.ngrok-free.dev'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '*.r2.cloudflarestorage.com',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_BOOKING_LINK: process.env.BOOKING_LINK,
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Server actions cap request bodies at 1 MB by default, which silently rejects ordinary phone photos; uploads allow 10 MB plus form overhead.
  experimental: {
    serverActions: { bodySizeLimit: '12mb' },
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // ✅ Ignore all TypeScript errors
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Ignore all ESLint errors
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
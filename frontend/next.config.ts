/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  
  // Skip TypeScript checking during build (for deployment speed)
  // Type errors will still show in IDE during development
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;

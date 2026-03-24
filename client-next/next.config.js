/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true, // required for static export
  },
  // Disable the x-powered-by header
  poweredByHeader: false,
};

module.exports = nextConfig;
// deploy trigger

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove experimental.appDir as it's no longer needed in Next.js 15
  // Ensure proper routing for App Router
  trailingSlash: false,
  // Enable static export if needed
  output: 'standalone',
  // Ensure proper image optimization
  images: {
    unoptimized: true,
  },
  // Remove problematic redirects that cause infinite loops
  // async redirects() {
  //   return [
  //     {
  //       source: '/',
  //       destination: '/',
  //       permanent: false,
  //     },
  //   ]
  // },
}

module.exports = nextConfig

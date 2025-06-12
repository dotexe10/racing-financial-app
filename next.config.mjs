/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Ensure proper routing
  trailingSlash: false,
  // Fix for static export if needed
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
}

export default nextConfig

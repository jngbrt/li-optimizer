/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Remove swcMinify as it's no longer needed in Next.js 15
  env: {
    // Properly set NEXTAUTH_URL based on environment
    NEXTAUTH_URL: process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },
  // Add this to help with debugging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // Fix the experimental config
  experimental: {
    // serverActions is now enabled by default in Next.js 15
  },
}

export default nextConfig

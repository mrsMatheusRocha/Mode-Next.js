import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    useCache: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
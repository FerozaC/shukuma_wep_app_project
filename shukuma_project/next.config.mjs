/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    const apiBase = base.endsWith("/api") ? base : `${base}/api`
    return [
      {
        source: "/api/:path*",
        destination: `${apiBase}/:path*`,
      },
    ]
  },
}

export default nextConfig

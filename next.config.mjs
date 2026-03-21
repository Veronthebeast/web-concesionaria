/** @type {import('next').NextConfig} */
// Placeholder - will be configured in Fase 5
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
}

export default nextConfig

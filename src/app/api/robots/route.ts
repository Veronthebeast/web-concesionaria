import { NextResponse } from 'next/server'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://web-concesionaria.vercel.app'

export async function GET() {
  const robots = `User-agent: *
Allow: /

Sitemap: ${BASE_URL}/sitemap.xml

# Disallow admin routes
Disallow: /admin
Disallow: /auth
`
  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 's-maxage=86400, stale-while-revalidate',
    },
  })
}

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://web-concesionaria.vercel.app'

export async function GET() {
  try {
    const { data: vehiculos, error } = await supabase
      .from('vehiculos')
      .select('slug, updated_at')
      .eq('activo', true)
      .eq('estado', 'disponible')

    if (error) {
      console.error('Error fetching vehiculos for sitemap:', error)
      return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 })
    }

    const now = new Date().toISOString().split('T')[0]

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${BASE_URL}/catalogo</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  ${vehiculos?.map((v) => `
  <url>
    <loc>${BASE_URL}/catalogo/vehiculos/${v.slug}</loc>
    <lastmod>${v.updated_at ? new Date(v.updated_at).toISOString().split('T')[0] : now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  `).join('')}
</urlset>`

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      },
    })
  } catch (error) {
    console.error('Sitemap error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

import { createClient } from '../client'

export interface Banner {
  id: string
  titulo: string | null
  imagen_url: string
  enlace_url: string | null
  orden: number
  activo: boolean
  created_at: string
}

// Get all active banners for carousel
export async function getBannersActivos(): Promise<Banner[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('carousel_banners')
    .select('*')
    .eq('activo', true)
    .order('orden', { ascending: true })

  if (error || !data) return []

  return data
}

// Get all banners for admin
export async function getAllBanners(): Promise<Banner[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('carousel_banners')
    .select('*')
    .order('orden', { ascending: true })

  return data || []
}

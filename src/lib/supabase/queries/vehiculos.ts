import { createClient } from '../client'
import type { Vehiculo, VehiculoCompleto, FiltrosCatalogo, MetricasDashboard, FotoVehiculo } from '@/types'

// Helper para formatear slug
function generarSlug(marca: string, modelo: string, anio: number, id: string): string {
  const base = `${marca}-${modelo}-${anio}`.toLowerCase().replace(/\s+/g, '-')
  const suffix = id.slice(0, 4)
  return `${base}-${suffix}`
}

// Get all active vehicles for catalog
export async function getVehiculos(filtros?: FiltrosCatalogo): Promise<VehiculoCompleto[]> {
  const supabase = createClient()
  
  let query = supabase
    .from('vehiculos')
    .select('*')
    .eq('activo', true)
    .order('orden', { ascending: true })

  if (filtros?.tipo) {
    query = query.eq('tipo', filtros.tipo)
  }
  if (filtros?.estado) {
    query = query.eq('estado', filtros.estado)
  }
  if (filtros?.anioDesde) {
    query = query.gte('anio', filtros.anioDesde)
  }
  if (filtros?.anioHasta) {
    query = query.lte('anio', filtros.anioHasta)
  }
  if (filtros?.precioMax) {
    query = query.lte('precio', filtros.precioMax)
  }

  const { data: vehiculos, error } = await query

  if (error || !vehiculos) return []

  // Filtrar por marca en memoria (para dropdown dinámico)
  let resultados = vehiculos
  if (filtros?.marca) {
    resultados = resultados.filter(v => v.marca === filtros.marca)
  }

  // Obtener fotos para cada vehículo
  const vehiculosConFotos: VehiculoCompleto[] = await Promise.all(
    resultados.map(async (vehiculo) => {
      const { data: fotos } = await supabase
        .from('fotos_vehiculo')
        .select('*')
        .eq('vehiculo_id', vehiculo.id)
        .order('orden', { ascending: true })

      return {
        ...vehiculo,
        fotos: fotos || []
      }
    })
  )

  return vehiculosConFotos
}

// Get single vehicle by slug with photos
export async function getVehiculoPorSlug(slug: string): Promise<VehiculoCompleto | null> {
  const supabase = createClient()

  const { data: vehiculo, error } = await supabase
    .from('vehiculos')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !vehiculo) return null

  const { data: fotos } = await supabase
    .from('fotos_vehiculo')
    .select('*')
    .eq('vehiculo_id', vehiculo.id)
    .order('orden', { ascending: true })

  return {
    ...vehiculo,
    fotos: fotos || []
  }
}

// Get featured vehicles
export async function getVehiculosDestacados(limite = 6): Promise<VehiculoCompleto[]> {
  const supabase = createClient()

  const { data: vehiculos, error } = await supabase
    .from('vehiculos')
    .select('*')
    .eq('activo', true)
    .eq('destacado', true)
    .order('orden', { ascending: true })
    .limit(limite)

  if (error || !vehiculos) return []

  const vehiculosConFotos: VehiculoCompleto[] = await Promise.all(
    vehiculos.map(async (vehiculo) => {
      const { data: fotos } = await supabase
        .from('fotos_vehiculo')
        .select('*')
        .eq('vehiculo_id', vehiculo.id)
        .order('orden', { ascending: true })

      return {
        ...vehiculo,
        fotos: fotos || []
      }
    })
  )

  return vehiculosConFotos
}

// Get available brands for filter dropdown
export async function getMarcasDisponibles(): Promise<string[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('vehiculos')
    .select('marca')
    .eq('activo', true)

  if (error || !data) return []

  const marcas = Array.from(new Set(data.map(v => v.marca)))
  return marcas.sort()
}

// Admin-only queries
export async function getVehiculosAdmin(): Promise<Vehiculo[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('vehiculos')
    .select('*')
    .order('created_at', { ascending: false })

  return data || []
}

export async function getMetricasDashboard(): Promise<MetricasDashboard> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('vehiculos')
    .select('estado, tipo')

  if (error || !data) {
    return { total: 0, disponibles: 0, reservados: 0, vendidos: 0, autos: 0, motos: 0 }
  }

  return {
    total: data.length,
    disponibles: data.filter(v => v.estado === 'disponible').length,
    reservados: data.filter(v => v.estado === 'reservado').length,
    vendidos: data.filter(v => v.estado === 'vendido').length,
    autos: data.filter(v => v.tipo === 'auto').length,
    motos: data.filter(v => v.tipo === 'moto').length,
  }
}
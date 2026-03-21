import { createClient } from '../client'
import type { Vehiculo, VehiculoCompleto, FiltrosCatalogo, MetricasDashboard } from '@/types'

// Get all active vehicles for catalog
export async function getVehiculos(filtros?: FiltrosCatalogo): Promise<Vehiculo[] | null> {
  // TODO: implement with Supabase query
  return null
}

// Get single vehicle by slug with photos
export async function getVehiculoPorSlug(slug: string): Promise<VehiculoCompleto | null> {
  // TODO: implement with Supabase query
  return null
}

// Get featured vehicles
export async function getVehiculosDestacados(limite = 6): Promise<Vehiculo[] | null> {
  // TODO: implement with Supabase query
  return null
}

// Get available brands for filter dropdown
export async function getMarcasDisponibles(): Promise<string[] | null> {
  // TODO: implement with Supabase query
  return null
}

// Admin-only queries (use service key)
export async function getVehiculosAdmin(): Promise<Vehiculo[] | null> {
  // TODO: implement with Supabase query
  return null
}

export async function getMetricasDashboard(): Promise<MetricasDashboard | null> {
  // TODO: implement with Supabase query
  return null
}

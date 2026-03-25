export type TipoVehiculo = 'auto' | 'moto'
export type EstadoVehiculo = 'disponible' | 'reservado' | 'vendido'
export type Combustible = 'nafta' | 'diesel' | 'gnc' | 'electrico' | 'hibrido'
export type Transmision = 'manual' | 'automatica'
export type Moneda = 'ARS' | 'USD'

export interface Vehiculo {
  id: string
  tipo: TipoVehiculo
  marca: string
  modelo: string
  version?: string | null
  anio: number
  km: number
  precio: number
  moneda: Moneda
  color?: string | null
  combustible?: Combustible | null
  transmision?: Transmision | null
  puertas?: number | null
  descripcion?: string | null
  estado: EstadoVehiculo
  destacado: boolean
  financiacion: boolean
  slug: string
  orden: number
  activo: boolean
  created_at: string
  updated_at: string
}

export interface FotoVehiculo {
  id: string
  vehiculo_id: string
  url: string
  storage_path: string
  orden: number
  created_at: string
}

export interface VehiculoCompleto extends Vehiculo {
  fotos: FotoVehiculo[]
}

export interface FiltrosCatalogo {
  tipo?: TipoVehiculo
  marca?: string
  busqueda?: string
  precioMax?: number
  anioDesde?: number
  anioHasta?: number
  estado?: EstadoVehiculo
}

export interface MetricasDashboard {
  total: number
  disponibles: number
  reservados: number
  vendidos: number
  autos: number
  motos: number
}

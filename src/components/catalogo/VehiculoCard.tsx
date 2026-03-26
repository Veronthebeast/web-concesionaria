import Link from 'next/link'
import Image from 'next/image'
import type { Vehiculo, FotoVehiculo } from '@/types'

interface VehiculoCardProps {
  vehiculo: Vehiculo
  fotoPrincipal?: FotoVehiculo | null
}

function formatearKm(km: number): string {
  return km.toLocaleString('es-AR') + ' km'
}

function formatearPrecio(precio: number, moneda: string): string {
  if (moneda === 'USD') {
    return `U$S ${precio.toLocaleString('es-AR')}`
  }
  return `$ ${precio.toLocaleString('es-AR')}`
}

export function VehiculoCard({ vehiculo, fotoPrincipal }: VehiculoCardProps) {
  const esVendido = vehiculo.estado === 'vendido'
  
  return (
    <Link href={`/catalogo/vehiculos/${vehiculo.slug}`}>
      <article className="bg-blanco rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg hover:border-red-300 transition-all duration-200 group">
        {/* Imagen */}
        <div className="relative aspect-[4/3] bg-gray-100">
          {fotoPrincipal ? (
            <Image
              src={fotoPrincipal.url}
              alt={`${vehiculo.marca} ${vehiculo.modelo}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {/* Badge de estado */}
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              vehiculo.estado === 'disponible' ? 'bg-green-500 text-white' :
              vehiculo.estado === 'reservado' ? 'bg-yellow-500 text-white' :
              'bg-gray-500 text-white'
            }`}>
              {vehiculo.estado.charAt(0).toUpperCase() + vehiculo.estado.slice(1)}
            </span>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-4">
          <h3 className="font-semibold text-negro text-lg truncate">
            {vehiculo.marca} {vehiculo.modelo}
          </h3>
          <p className="text-sm text-gray-500">{vehiculo.anio} • {formatearKm(vehiculo.km)}</p>
          
          <div className="mt-4 flex items-center justify-between">
            <p className="font-bold text-xl text-negro">
              {formatearPrecio(vehiculo.precio, vehiculo.moneda)}
            </p>
            <span className="text-red-600 font-medium text-sm group-hover:text-red-700">
              Ver →
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}

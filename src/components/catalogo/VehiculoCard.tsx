import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/Badge'
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
  return (
    <Link href={`/catalogo/vehiculos/${vehiculo.slug}`}>
      <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {/* Imagen */}
        <div className="relative aspect-[4/3] bg-gray-100">
          {fotoPrincipal ? (
            <Image
              src={fotoPrincipal.url}
              alt={`${vehiculo.marca} ${vehiculo.modelo}`}
              fill
              className="object-cover"
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
          <div className="absolute top-2 right-2">
            <Badge variant="estado" estado={vehiculo.estado}>
              {vehiculo.estado.charAt(0).toUpperCase() + vehiculo.estado.slice(1)}
            </Badge>
          </div>
          {/* Badge financiación */}
          {vehiculo.financiacion && (
            <div className="absolute top-2 left-2">
              <Badge variant="success">Financiación</Badge>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-lg">
            {vehiculo.marca} {vehiculo.modelo}
          </h3>
          <p className="text-sm text-gray-500">{vehiculo.anio} • {formatearKm(vehiculo.km)}</p>
          
          <div className="mt-3 flex items-center justify-between">
            <p className="font-bold text-lg text-gray-900">
              {formatearPrecio(vehiculo.precio, vehiculo.moneda)}
            </p>
            <span className="text-sm text-blue-600 font-medium">Ver detalles →</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
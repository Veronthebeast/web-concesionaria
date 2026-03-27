import { VehiculoCard } from './VehiculoCard'
import type { VehiculoCompleto } from '@/types'

interface VehiculoGridProps {
  vehiculos: VehiculoCompleto[]
}

export function VehiculoGrid({ vehiculos }: VehiculoGridProps) {
  if (vehiculos.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.828a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-gray-500 text-lg mb-2">No se encontraron vehículos</p>
        <p className="text-gray-400 text-sm">Probá cambiando los filtros de búsqueda</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehiculos.map((vehiculo) => (
        <VehiculoCard
          key={vehiculo.id}
          vehiculo={vehiculo}
          fotoPrincipal={vehiculo.fotos[0]}
        />
      ))}
    </div>
  )
}

import { VehiculoCard } from './VehiculoCard'
import type { VehiculoCompleto } from '@/types'

interface VehiculoGridProps {
  vehiculos: VehiculoCompleto[]
}

export function VehiculoGrid({ vehiculos }: VehiculoGridProps) {
  if (vehiculos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No encontramos vehículos con esos filtros</p>
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
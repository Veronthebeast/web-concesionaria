import { VehiculoCard } from './VehiculoCard'
import type { VehiculoCompleto } from '@/types'

interface SeccionDestacadosProps {
  vehiculos: VehiculoCompleto[]
}

export function SeccionDestacados({ vehiculos }: SeccionDestacadosProps) {
  if (vehiculos.length === 0) return null

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Vehículos Destacados</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehiculos.slice(0, 6).map((vehiculo) => (
          <VehiculoCard
            key={vehiculo.id}
            vehiculo={vehiculo}
            fotoPrincipal={vehiculo.fotos[0]}
          />
        ))}
      </div>
    </section>
  )
}
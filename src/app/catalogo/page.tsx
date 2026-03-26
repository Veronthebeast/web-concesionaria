import { getVehiculos, getMarcasDisponibles } from '@/lib/supabase/queries/vehiculos'
import { FiltrosPanelClient } from '../FiltrosPanelClient'
import { VehiculosConFiltros } from '../VehiculosConFiltros'

export const revalidate = 60

export default async function CatalogoPage() {
  const [vehiculos, marcas] = await Promise.all([
    getVehiculos(),
    getMarcasDisponibles()
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Catálogo</h1>
          <p className="text-gray-600 mt-1">Todos los vehículos disponibles</p>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Panel de filtros */}
          <div className="lg:col-span-1">
            <FiltrosPanelClient marcas={marcas} />
          </div>
          
          {/* Grid de vehículos */}
          <div className="lg:col-span-3">
            <VehiculosConFiltros vehiculos={vehiculos} />
          </div>
        </div>
      </main>
    </div>
  )
}

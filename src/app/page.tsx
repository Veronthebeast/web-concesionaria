import { getVehiculos, getVehiculosDestacados, getMarcasDisponibles } from '@/lib/supabase/queries/vehiculos'
import { SeccionDestacados } from '@/components/catalogo/SeccionDestacados'
import { FiltrosPanelClient } from './FiltrosPanelClient'
import { VehiculosConFiltros } from './VehiculosConFiltros'

export const revalidate = 60

export default async function HomePage() {
  const [vehiculos, vehiculosDestacados, marcas] = await Promise.all([
    getVehiculos(),
    getVehiculosDestacados(),
    getMarcasDisponibles()
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Destacados */}
        <SeccionDestacados vehiculos={vehiculosDestacados} />

        {/* Catálogo con filtros */}
        <section>
          <h2 className="text-2xl font-bold text-negro mb-6">Todos los vehículos</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Panel de filtros */}
            <div className="lg:col-span-1">
              <FiltrosPanelClient marcas={marcas} />
            </div>
            
            {/* Grid de vehículos */}
            <div className="lg:col-span-3">
              <VehiculosConFiltros vehiculos={vehiculos} />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

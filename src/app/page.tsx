import { getVehiculos, getVehiculosDestacados, getMarcasDisponibles } from '@/lib/supabase/queries/vehiculos'
import { SeccionDestacados } from '@/components/catalogo/SeccionDestacados'
import { FiltrosPanelClient } from './FiltrosPanelClient'
import { VehiculosConFiltros } from './VehiculosConFiltros'

export const revalidate = 60 // ISR: revalidar cada 60 segundos

export default async function HomePage() {
  const [vehiculos, vehiculosDestacados, marcas] = await Promise.all([
    getVehiculos(),
    getVehiculosDestacados(),
    getMarcasDisponibles()
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Concesionaria</h1>
          <p className="text-gray-600 mt-1">Autos y motos disponibles</p>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Destacados */}
        <SeccionDestacados vehiculos={vehiculosDestacados} />

        {/* Catálogo con filtros */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Todos los vehículos</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Panel de filtros (Client Component) */}
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© 2024 Concesionaria. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
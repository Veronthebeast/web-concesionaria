import { getVehiculos, getVehiculosDestacados, getMarcasDisponibles } from '@/lib/supabase/queries/vehiculos'
import { getBannersActivos } from '@/lib/supabase/queries/banners'
import { SeccionDestacados } from '@/components/catalogo/SeccionDestacados'
import { FiltrosPanelClient } from './FiltrosPanelClient'
import { VehiculosConFiltros } from './VehiculosConFiltros'
import { Carrousel } from '@/components/home/Carrousel'

export const revalidate = 60

export default async function HomePage() {
  const [vehiculos, vehiculosDestacados, marcas, banners] = await Promise.all([
    getVehiculos(),
    getVehiculosDestacados(),
    getMarcasDisponibles(),
    getBannersActivos()
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Carrousel */}
      <Carrousel banners={banners} />

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

        {/* Sección Nosotros */}
        <section id="nosotros" className="mt-16">
          <h2 className="text-2xl font-bold text-negro mb-8 text-center">Sobre Nosotros</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Garantía</h3>
              <p className="text-gray-600">Todos nuestros vehículos pasan por un rigurosoontrol de calidad.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Financiación</h3>
              <p className="text-gray-600">Facilidades de pago y financiación a tu medida.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Atención Personalizada</h3>
              <p className="text-gray-600">Te asesoramos para encontrar el vehículo ideal.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

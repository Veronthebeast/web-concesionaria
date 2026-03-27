'use client'

import { useFiltrosStore } from '@/store/filtros'
import { FiltrosPanel } from '@/components/catalogo/FiltrosPanel'
import { VehiculoGrid } from '@/components/catalogo/VehiculoGrid'
import type { VehiculoCompleto } from '@/types'

interface Props {
  vehiculos: VehiculoCompleto[]
  marcas: string[]
  busquedaInicial?: string
}

export function CatalogoContent({ vehiculos, marcas, busquedaInicial }: Props) {
  const { setFiltro, vehiculosFiltrados } = useFiltrosStore()

  // Aplicar búsqueda inicial si viene de la URL
  if (busquedaInicial) {
    setFiltro('busqueda', busquedaInicial)
  }

  const vehiculosFiltradosList = vehiculosFiltrados(vehiculos)

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-negro mb-8">Catálogo</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <FiltrosPanel marcas={marcas} />
          </div>
          <div className="lg:col-span-3">
            {vehiculosFiltradosList.length > 0 ? (
              <VehiculoGrid vehiculos={vehiculosFiltradosList} />
            ) : (
              <div className="text-center py-12 text-gray-500">
                No se encontraron vehículos con los filtros seleccionados.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

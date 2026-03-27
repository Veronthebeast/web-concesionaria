'use client'

import { useEffect, useState } from 'react'
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
  const { setFiltro, vehiculosFiltrados, resetFiltros } = useFiltrosStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Aplicar búsqueda inicial si viene de URL
    if (busquedaInicial) {
      setFiltro('busqueda', busquedaInicial)
    }
  }, [busquedaInicial, setFiltro])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-negro mb-8">Catálogo</h1>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-blanco p-5 rounded-lg border border-gray-200 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-5 w-20"></div>
                <div className="space-y-4">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="bg-blanco rounded-lg border border-gray-200 p-4 animate-pulse">
                    <div className="aspect-[4/3] bg-gray-200 rounded mb-4"></div>
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    )
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
              <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.828a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500 text-lg mb-2">No se encontraron vehículos</p>
                <p className="text-gray-400 text-sm">Probá cambiando los filtros de búsqueda</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

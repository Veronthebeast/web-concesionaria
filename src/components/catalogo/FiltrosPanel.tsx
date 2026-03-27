'use client'

import { useEffect, useState } from 'react'
import { useFiltrosStore } from '@/store/filtros'
import type { TipoVehiculo, EstadoVehiculo } from '@/types'

interface FiltrosPanelProps {
  marcas: string[]
}

export function FiltrosPanel({ marcas }: FiltrosPanelProps) {
  const { filtros, setFiltro, resetFiltros } = useFiltrosStore()
  const [mounted, setMounted] = useState(false)

  // Evitar hydrated mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <aside className="bg-blanco p-5 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-negro">Filtros</h3>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </aside>
    )
  }

  const handleSetFiltro = <K extends keyof typeof filtros>(campo: K, valor: typeof filtros[K]) => {
    setFiltro(campo, valor)
  }

  return (
    <aside className="bg-blanco p-5 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-semibold text-negro">Filtros</h3>
        <button
          onClick={resetFiltros}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Limpiar
        </button>
      </div>

      <div className="space-y-5">
        {/* Buscador */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
          <input
            type="text"
            value={filtros.busqueda || ''}
            onChange={(e) => handleSetFiltro('busqueda', e.target.value)}
            placeholder="Marca, modelo..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
          <select
            value={filtros.tipo || ''}
            onChange={(e) => handleSetFiltro('tipo', (e.target.value || undefined) as TipoVehiculo | undefined)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          >
            <option value="">Todos</option>
            <option value="auto">Autos</option>
            <option value="moto">Motos</option>
          </select>
        </div>

        {/* Marca */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Marca</label>
          <select
            value={filtros.marca || ''}
            onChange={(e) => handleSetFiltro('marca', e.target.value || undefined)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          >
            <option value="">Todas</option>
            {marcas.map((marca) => (
              <option key={marca} value={marca}>{marca}</option>
            ))}
          </select>
        </div>

        {/* Precio máximo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Precio máximo</label>
          <input
            type="number"
            value={filtros.precioMax || ''}
            onChange={(e) => handleSetFiltro('precioMax', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="Ej: 15000000"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>

        {/* Año desde */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Año desde</label>
          <input
            type="number"
            value={filtros.anioDesde || ''}
            onChange={(e) => handleSetFiltro('anioDesde', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="Ej: 2018"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>

        {/* Año hasta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Año hasta</label>
          <input
            type="number"
            value={filtros.anioHasta || ''}
            onChange={(e) => handleSetFiltro('anioHasta', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="Ej: 2024"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          />
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
          <select
            value={filtros.estado || ''}
            onChange={(e) => handleSetFiltro('estado', (e.target.value || undefined) as EstadoVehiculo | undefined)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
          >
            <option value="">Todos</option>
            <option value="disponible">Disponible</option>
            <option value="reservado">Reservado</option>
            <option value="vendido">Vendido</option>
          </select>
        </div>
      </div>
    </aside>
  )
}

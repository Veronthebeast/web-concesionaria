'use client'

import { useFiltrosStore } from '@/store/filtros'
import type { TipoVehiculo, EstadoVehiculo } from '@/types'

interface FiltrosPanelProps {
  marcas: string[]
}

export function FiltrosPanel({ marcas }: FiltrosPanelProps) {
  const { filtros, setFiltro, resetFiltros } = useFiltrosStore()

  return (
    <aside className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Filtros</h3>
        <button
          onClick={resetFiltros}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Limpiar filtros
        </button>
      </div>

      <div className="space-y-4">
        {/* Buscador */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <input
            type="text"
            value={filtros.busqueda || ''}
            onChange={(e) => setFiltro('busqueda', e.target.value || undefined)}
            placeholder="Marca, modelo..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
          <select
            value={filtros.tipo || ''}
            onChange={(e) => setFiltro('tipo', (e.target.value || undefined) as TipoVehiculo | undefined)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            <option value="auto">Autos</option>
            <option value="moto">Motos</option>
          </select>
        </div>

        {/* Marca */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
          <select
            value={filtros.marca || ''}
            onChange={(e) => setFiltro('marca', e.target.value || undefined)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas</option>
            {marcas.map((marca) => (
              <option key={marca} value={marca}>{marca}</option>
            ))}
          </select>
        </div>

        {/* Precio máximo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Precio máximo</label>
          <input
            type="number"
            value={filtros.precioMax || ''}
            onChange={(e) => setFiltro('precioMax', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="Ej: 15000000"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Año desde */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Año desde</label>
          <input
            type="number"
            value={filtros.anioDesde || ''}
            onChange={(e) => setFiltro('anioDesde', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="Ej: 2018"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Año hasta */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Año hasta</label>
          <input
            type="number"
            value={filtros.anioHasta || ''}
            onChange={(e) => setFiltro('anioHasta', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="Ej: 2024"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            value={filtros.estado || ''}
            onChange={(e) => setFiltro('estado', (e.target.value || undefined) as EstadoVehiculo | undefined)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
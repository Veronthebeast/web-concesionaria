'use client'

import { VehiculoGrid } from '@/components/catalogo/VehiculoGrid'
import { useFiltrosStore } from '@/store/filtros'
import type { VehiculoCompleto } from '@/types'

interface VehiculosConFiltrosProps {
  vehiculos: VehiculoCompleto[]
}

export function VehiculosConFiltros({ vehiculos }: VehiculosConFiltrosProps) {
  const vehiculosFiltrados = useFiltrosStore(state => state.vehiculosFiltrados)
  return <VehiculoGrid vehiculos={vehiculosFiltrados(vehiculos)} />
}
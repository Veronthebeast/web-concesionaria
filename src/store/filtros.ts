import { create } from 'zustand'
import type { FiltrosCatalogo, VehiculoCompleto } from '@/types'

interface FiltrosStore {
  filtros: FiltrosCatalogo
  setFiltro: <K extends keyof FiltrosCatalogo>(campo: K, valor: FiltrosCatalogo[K]) => void
  resetFiltros: () => void
  vehiculosFiltrados: (vehiculos: VehiculoCompleto[]) => VehiculoCompleto[]
}

export const useFiltrosStore = create<FiltrosStore>((set, get) => ({
  filtros: {},
  
  setFiltro: (campo, valor) => set((state) => ({
    filtros: { ...state.filtros, [campo]: valor }
  })),
  
  resetFiltros: () => set({ filtros: {} }),
  
  vehiculosFiltrados: (vehiculos) => {
    const { filtros } = get()
    const busqueda = filtros.busqueda?.toLowerCase().trim() || ''
    
    return vehiculos.filter(v => {
      if (filtros.tipo && v.tipo !== filtros.tipo) return false
      if (filtros.marca && v.marca !== filtros.marca) return false
      if (filtros.precioMax && v.precio > filtros.precioMax) return false
      if (filtros.anioDesde && v.anio < filtros.anioDesde) return false
      if (filtros.anioHasta && v.anio > filtros.anioHasta) return false
      if (filtros.estado && v.estado !== filtros.estado) return false
      if (busqueda) {
        const textoVehiculo = `${v.marca} ${v.modelo} ${v.version || ''}`.toLowerCase()
        if (!textoVehiculo.includes(busqueda)) return false
      }
      return true
    })
  }
}))

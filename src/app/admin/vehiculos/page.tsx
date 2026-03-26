'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toggleDestacado, toggleActivo, eliminarVehiculo } from '@/app/admin/actions'
import Image from 'next/image'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

interface Vehiculo {
  id: string
  marca: string
  modelo: string
  anio: number
  tipo: string
  precio: number
  moneda: string
  estado: string
  destacado: boolean
  activo: boolean
  slug: string
  fotoPrincipal?: string | null
}

function Badge({ children, estado }: { children: React.ReactNode, estado?: string }) {
  const colores: Record<string, string> = {
    disponible: 'bg-green-100 text-green-800',
    reservado: 'bg-yellow-100 text-yellow-800',
    vendido: 'bg-gray-100 text-gray-800'
  }
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${colores[estado || ''] || 'bg-gray-100'}`}>
      {children}
    </span>
  )
}

export default function AdminVehiculosPage() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [loading, setLoading] = useState(true)

  const fetchVehiculos = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      window.location.href = '/auth/login'
      return
    }

    const { data: vehiculosData } = await supabase
      .from('vehiculos')
      .select('*')
      .order('created_at', { ascending: false })

    if (vehiculosData) {
      const vehiculosConFotos = await Promise.all(
        vehiculosData.map(async (v) => {
          const { data: fotos } = await supabase
            .from('fotos_vehiculo')
            .select('url')
            .eq('vehiculo_id', v.id)
            .eq('orden', 0)
            .limit(1)
          return { ...v, fotoPrincipal: fotos?.[0]?.url || null }
        })
      )
      setVehiculos(vehiculosConFotos)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchVehiculos()
  }, [])

  const handleToggle = async (id: string, field: 'destacado' | 'activo', value: boolean) => {
    // Actualizar inmediatamente el estado local
    setVehiculos(prev => prev.map(v => 
      v.id === id ? { ...v, [field]: value } : v
    ))
    
    const supabase = createClient()
    await supabase.from('vehiculos').update({ [field]: value }).eq('id', id)
    revalidatePath('/admin/vehiculos')
    revalidatePath('/')
  }

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Eliminar vehículo?')) return
    
    // Eliminar inmediatamente del estado local para mejor UX
    setVehiculos(prev => prev.filter(v => v.id !== id))
    
    const supabase = createClient()
    
    // Eliminar fotos del storage
    const { data: fotos } = await supabase
      .from('fotos_vehiculo')
      .select('storage_path')
      .eq('vehiculo_id', id)

    if (fotos && fotos.length > 0) {
      await supabase.storage.from('vehiculos-fotos').remove(fotos.map(f => f.storage_path))
    }

    // Eliminar de DB
    await supabase.from('vehiculos').delete().eq('id', id)
    revalidatePath('/admin/vehiculos')
    revalidatePath('/')
  }

  if (loading) {
    return <div className="p-8">Cargando...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vehículos</h1>
        <Link
          href="/admin/vehiculos/nuevo"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Nuevo vehículo
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Foto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehículo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destacado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehiculos.map((vehiculo) => (
              <tr key={vehiculo.id}>
                <td className="px-6 py-4">
                  <div className="w-16 h-12 relative bg-gray-100 rounded overflow-hidden">
                    {vehiculo.fotoPrincipal ? (
                      <Image src={vehiculo.fotoPrincipal} alt="" fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                        Sin foto
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">
                    {vehiculo.marca} {vehiculo.modelo}
                  </div>
                  <div className="text-sm text-gray-500">
                    {vehiculo.anio} • {vehiculo.tipo}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium">
                    {vehiculo.moneda === 'USD' ? 'U$S' : '$'} {vehiculo.precio.toLocaleString('es-AR')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Badge estado={vehiculo.estado}>
                    {vehiculo.estado}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => handleToggle(vehiculo.id, 'destacado', !vehiculo.destacado)}
                    className={`w-12 h-6 rounded-full transition-colors ${vehiculo.destacado ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <span className={`block w-4 h-4 bg-white rounded-full transform transition-transform ${vehiculo.destacado ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => handleToggle(vehiculo.id, 'activo', !vehiculo.activo)}
                    className={`w-12 h-6 rounded-full transition-colors ${vehiculo.activo ? 'bg-green-500' : 'bg-gray-300'}`}
                  >
                    <span className={`block w-4 h-4 bg-white rounded-full transform transition-transform ${vehiculo.activo ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Link href={`/admin/vehiculos/${vehiculo.id}/editar`} className="text-blue-600 hover:text-blue-800">
                      Editar
                    </Link>
                    <Link href={`/catalogo/vehiculos/${vehiculo.slug}`} target="_blank" className="text-gray-600 hover:text-gray-800">
                      Ver
                    </Link>
                    <button 
                      onClick={() => handleEliminar(vehiculo.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {vehiculos.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No hay vehículos cargados. ¡Cargá el primero!
          </div>
        )}
      </div>
    </div>
  )
}

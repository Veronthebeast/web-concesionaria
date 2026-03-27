'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'
import { revalidatePath } from 'next/cache'

interface Banner {
  id: string
  titulo: string | null
  imagen_url: string
  enlace_url: string | null
  orden: number
  activo: boolean
}

interface Vehiculo {
  id: string
  marca: string
  modelo: string
  anio: number
  slug: string
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([])
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [editando, setEditando] = useState<Banner | null>(null)

  const fetchBanners = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('carousel_banners')
      .select('*')
      .order('orden', { ascending: true })
    setBanners(data || [])
    setLoading(false)
  }

  const fetchVehiculos = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('vehiculos')
      .select('id, marca, modelo, anio, slug')
      .eq('activo', true)
      .eq('estado', 'disponible')
      .order('marca', { ascending: true })
    setVehiculos(data || [])
  }

  useEffect(() => {
    fetchBanners()
    fetchVehiculos()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setGuardando(true)

    const form = e.currentTarget
    const formData = new FormData(form)
    
    const titulo = formData.get('titulo') as string
    let enlace_url = formData.get('enlace_url') as string
    const enlaceTipo = formData.get('enlace_tipo') as string
    const vehiculoId = formData.get('vehiculo_id') as string
    
    // Si seleccionó un vehículo, generar la URL
    if (enlaceTipo === 'vehiculo' && vehiculoId) {
      const vehiculo = vehiculos.find(v => v.id === vehiculoId)
      if (vehiculo) {
        enlace_url = `/catalogo/vehiculos/${vehiculo.slug}`
      }
    }
    
    const orden = parseInt(formData.get('orden') as string) || 0
    const activo = formData.get('activo') === 'true'
    
    const supabase = createClient()

    if (editando) {
      await supabase
        .from('carousel_banners')
        .update({ titulo: titulo || null, enlace_url: enlace_url || null, orden, activo })
        .eq('id', editando.id)
    } else {
      const imagenUrl = formData.get('imagen_url') as string
      if (!imagenUrl) {
        alert('Subí una imagen para el banner')
        setGuardando(false)
        return
      }
      
      await supabase
        .from('carousel_banners')
        .insert({
          titulo: titulo || null,
          imagen_url: imagenUrl,
          enlace_url: enlace_url || null,
          orden,
          activo
        })
    }

    form.reset()
    setEditando(null)
    setGuardando(false)
    fetchBanners()
    revalidatePath('/')
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (res.ok) {
      const data = await res.json()
      let input = document.getElementById('imagen_url') as HTMLInputElement
      if (!input) {
        input = document.createElement('input')
        input.type = 'hidden'
        input.name = 'imagen_url'
        input.id = 'imagen_url'
        e.target.form?.appendChild(input)
      }
      input.value = data.url
      
      const preview = document.getElementById('preview')
      if (preview) {
        (preview as HTMLImageElement).src = data.url
        preview.classList.remove('hidden')
      }
    }
  }

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Eliminar este banner?')) return

    const supabase = createClient()
    await supabase.from('carousel_banners').delete().eq('id', id)
    fetchBanners()
    revalidatePath('/')
  }

  const handleToggleActivo = async (id: string, activo: boolean) => {
    const supabase = createClient()
    await supabase.from('carousel_banners').update({ activo }).eq('id', id)
    fetchBanners()
    revalidatePath('/')
  }

  const handleEditar = (banner: Banner) => {
    setEditando(banner)
    document.getElementById('form-banner')?.scrollIntoView({ behavior: 'smooth' })
  }

  // Detectar si el enlace actual es de tipo vehículo
  const getEnlaceTipoActual = () => {
    if (!editando?.enlace_url) return 'libre'
    if (editando.enlace_url.includes('/catalogo/vehiculos/')) return 'vehiculo'
    return 'libre'
  }

  const getVehiculoIdActual = () => {
    if (!editando?.enlace_url) return ''
    const match = editando.enlace_url.match(/\/catalogo\/vehiculos\/(.+)/)
    if (match) {
      const vehiculo = vehiculos.find(v => v.slug === match[1])
      return vehiculo?.id || ''
    }
    return ''
  }

  if (loading) {
    return <div className="p-8">Cargando...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Carrousel / Banners</h1>

      {/* Formulario */}
      <div id="form-banner" className="bg-blanco rounded-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">
          {editando ? 'Editar Banner' : 'Nuevo Banner'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Imagen *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
            />
            <img id="preview" className="hidden mt-2 h-32 object-cover rounded" alt="Preview" />
            {!editando && (
              <p className="text-xs text-gray-500 mt-1">Subí una imagen para el banner</p>
            )}
            {editando && (
              <div className="mt-2">
                <img src={editando.imagen_url} alt="Actual" className="h-32 object-cover rounded" />
              </div>
            )}
            <input type="hidden" name="imagen_url" value={editando?.imagen_url || ''} />
          </div>

          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              type="text"
              name="titulo"
              defaultValue={editando?.titulo || ''}
              placeholder="Ej: Ofertas de Verano"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          {/* Tipo de enlace */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">¿A dónde lleva el banner?</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="enlace_tipo"
                  value="ninguno"
                  defaultChecked={!editando?.enlace_url}
                />
                <span className="text-sm">Sin enlace</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="enlace_tipo"
                  value="vehiculo"
                  defaultChecked={getEnlaceTipoActual() === 'vehiculo'}
                />
                <span className="text-sm">Vehículo</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="enlace_tipo"
                  value="libre"
                  defaultChecked={getEnlaceTipoActual() === 'libre' && !!editando?.enlace_url}
                />
                <span className="text-sm">URL libre</span>
              </label>
            </div>
          </div>

          {/* Selector de vehículo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Elegir vehículo</label>
            <select
              name="vehiculo_id"
              defaultValue={getVehiculoIdActual()}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">Seleccionar un vehículo...</option>
              {vehiculos.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.marca} {v.modelo} {v.anio}
                </option>
              ))}
            </select>
          </div>

          {/* URL libre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">O ingresá una URL</label>
            <input
              type="url"
              name="enlace_url"
              defaultValue={getEnlaceTipoActual() === 'libre' ? editando?.enlace_url || '' : ''}
              placeholder="https://..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          {/* Orden */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
            <input
              type="number"
              name="orden"
              defaultValue={editando?.orden || banners.length}
              min="0"
              className="w-32 border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          {/* Activo */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="activo"
              value="true"
              defaultChecked={editando?.activo ?? true}
              id="activo"
              className="w-4 h-4"
            />
            <label htmlFor="activo" className="text-sm text-gray-700">Activo</label>
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={guardando}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
            >
              {guardando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Crear banner'}
            </button>
            {editando && (
              <button
                type="button"
                onClick={() => setEditando(null)}
                className="px-6 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Listado */}
      <div className="bg-blanco rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Imagen</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enlace</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orden</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {banners.map((banner) => (
              <tr key={banner.id}>
                <td className="px-6 py-4">
                  <div className="w-24 h-16 relative rounded overflow-hidden bg-gray-100">
                    <Image src={banner.imagen_url} alt="" fill className="object-cover" />
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{banner.titulo || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {banner.enlace_url || '-'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{banner.orden}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleToggleActivo(banner.id, !banner.activo)}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      banner.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {banner.activo ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditar(banner)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(banner.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {banners.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No hay banners. ¡Creá el primero!
          </div>
        )}
      </div>
    </div>
  )
}

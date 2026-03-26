'use client'

import { useState, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'

interface FotoSubida {
  id?: string
  url: string
  storagePath: string
  esNueva: boolean
}

interface UploadFotosProps {
  fotosIniciales?: { id: string; url: string; storage_path: string }[]
  onFotosChange: (fotos: { url: string; storagePath: string }[]) => void
}

// Cliente Supabase público para uploads desde el browser
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export function UploadFotos({ fotosIniciales = [], onFotosChange }: UploadFotosProps) {
  const [fotos, setFotos] = useState<FotoSubida[]>(
    fotosIniciales.map(f => ({ id: f.id, url: f.url, storagePath: f.storage_path, esNueva: false }))
  )
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleArchivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivos = Array.from(e.target.files || [])
    if (archivos.length === 0) return
    
    if (fotos.length + archivos.length > 10) {
      setError('Máximo 10 fotos por vehículo')
      return
    }

    setSubiendo(true)
    setError('')

    const fotosNuevas: FotoSubida[] = []

    for (const archivo of archivos) {
      // Validar tipo
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(archivo.type)) {
        setError('Solo se permiten JPG, PNG y WebP')
        continue
      }
      
      // Validar tamaño (5MB)
      if (archivo.size > 5 * 1024 * 1024) {
        setError('Máximo 5MB por foto')
        continue
      }

      try {
        // Generar nombre único
        const ext = archivo.name.split('.').pop()
        const fileName = `temp/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

        // Subir a Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('vehiculos-fotos')
          .upload(fileName, archivo, {
            contentType: archivo.type,
            upsert: false
          })

        if (uploadError) {
          console.error('Error uploading:', uploadError)
          setError('Error al subir foto')
          continue
        }

        // Obtener URL pública
        const { data: urlData } = supabase.storage
          .from('vehiculos-fotos')
          .getPublicUrl(fileName)

        fotosNuevas.push({
          url: urlData.publicUrl,
          storagePath: fileName,
          esNueva: true
        })
      } catch (err) {
        console.error('Error:', err)
        setError('Error al subir foto')
      }
    }

    const fotosActualizadas = [...fotos, ...fotosNuevas]
    setFotos(fotosActualizadas)
    onFotosChange(fotosActualizadas.map(f => ({ url: f.url, storagePath: f.storagePath })))
    setSubiendo(false)

    // Limpiar input
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const eliminarFoto = (index: number) => {
    const fotosActualizadas = fotos.filter((_, i) => i !== index)
    setFotos(fotosActualizadas)
    onFotosChange(fotosActualizadas.map(f => ({ url: f.url, storagePath: f.storagePath })))
  }

  const moverFoto = (index: number, direccion: -1 | 1) => {
    const nuevoIndex = index + direccion
    if (nuevoIndex < 0 || nuevoIndex >= fotos.length) return

    const fotosActualizadas = [...fotos]
    const [fotoMovida] = fotosActualizadas.splice(index, 1)
    fotosActualizadas.splice(nuevoIndex, 0, fotoMovida)
    
    setFotos(fotosActualizadas)
    onFotosChange(fotosActualizadas.map(f => ({ url: f.url, storagePath: f.storagePath })))
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Fotos del vehículo (máx 10)
      </label>
      
      {error && (
        <div className="bg-red-50 text-red-700 px-3 py-2 rounded mb-3 text-sm">
          {error}
        </div>
      )}
      
      {/* Grid de fotos */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
        {fotos.map((foto, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
            <img 
              src={foto.url} 
              alt={`Foto ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Botón eliminar */}
            <button
              type="button"
              onClick={() => eliminarFoto(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Indicador de orden */}
            {index === 0 && (
              <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-1 rounded">
                Principal
              </span>
            )}
            {/* Botones mover */}
            <div className="absolute bottom-1 right-1 flex gap-1">
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => moverFoto(index, -1)}
                  className="bg-black/50 text-white rounded p-1 hover:bg-black/70"
                >
                  ↑
                </button>
              )}
              {index < fotos.length - 1 && (
                <button
                  type="button"
                  onClick={() => moverFoto(index, 1)}
                  className="bg-black/50 text-white rounded p-1 hover:bg-black/70"
                >
                  ↓
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Botón agregar */}
        {fotos.length < 10 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={subiendo}
            className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors disabled:opacity-50"
          >
            {subiendo ? (
              <span className="text-xs">Subiendo...</span>
            ) : (
              <>
                <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs">Agregar</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleArchivo}
        className="hidden"
      />

      <p className="text-xs text-gray-500">
        Formatos: JPG, PNG, WebP. Máximo 5MB por foto. La primera foto será la principal.
      </p>
    </div>
  )
}

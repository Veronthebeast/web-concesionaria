'use client'

import { useState, useRef } from 'react'

interface Foto {
  id?: string
  url: string
  archivo?: File
  esNueva?: boolean
}

interface UploadFotosProps {
  fotosIniciales?: { id: string; url: string; orden: number }[]
  onFotosChange: (fotos: { url: string; archivo?: File; id?: string; eliminar?: boolean }[]) => void
}

export function UploadFotos({ fotosIniciales = [], onFotosChange }: UploadFotosProps) {
  const [fotos, setFotos] = useState<Foto[]>(
    fotosIniciales.map(f => ({ id: f.id, url: f.url }))
  )
  const [subiendo, setSubiendo] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleArchivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivos = Array.from(e.target.files || [])
    if (fotos.length + archivos.length > 10) {
      alert('Máximo 10 fotos por vehículo')
      return
    }

    const nuevasFotos: Foto[] = archivos.map(archivo => ({
      url: URL.createObjectURL(archivo),
      archivo,
      esNueva: true
    }))

    const fotosActualizadas = [...fotos, ...nuevasFotos]
    setFotos(fotosActualizadas)
    onFotosChange(fotosActualizadas.map(f => ({ 
      url: f.url, 
      archivo: f.archivo,
      id: f.id 
    })))
  }

  const eliminarFoto = (index: number) => {
    const fotoEliminada = fotos[index]
    const fotosActualizadas = fotos.filter((_, i) => i !== index)
    setFotos(fotosActualizadas)
    
    // Si tiene ID, marcar para eliminar en el servidor
    if (fotoEliminada.id) {
      onFotosChange([...fotosActualizadas.map(f => ({ 
        url: f.url, 
        archivo: f.archivo,
        id: f.id,
        eliminar: f.id === fotoEliminada.id
      })), { 
        url: fotoEliminada.url, 
        id: fotoEliminada.id, 
        eliminar: true 
      }])
    } else {
      onFotosChange(fotosActualizadas.map(f => ({ 
        url: f.url, 
        archivo: f.archivo 
      })))
    }
  }

  const moverFoto = (index: number, direccion: -1 | 1) => {
    const nuevoIndex = index + direccion
    if (nuevoIndex < 0 || nuevoIndex >= fotos.length) return

    const fotosActualizadas = [...fotos]
    const [fotoMovida] = fotosActualizadas.splice(index, 1)
    fotosActualizadas.splice(nuevoIndex, 0, fotoMovida)
    
    setFotos(fotosActualizadas)
    onFotosChange(fotosActualizadas.map(f => ({ 
      url: f.url, 
      archivo: f.archivo,
      id: f.id 
    })))
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Fotos del vehículo (máx 10)
      </label>
      
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
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
              )}
              {index < fotos.length - 1 && (
                <button
                  type="button"
                  onClick={() => moverFoto(index, 1)}
                  className="bg-black/50 text-white rounded p-1 hover:bg-black/70"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
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
            className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
          >
            <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs">Agregar</span>
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

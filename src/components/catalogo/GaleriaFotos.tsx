'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { FotoVehiculo } from '@/types'

interface GaleriaFotosProps {
  fotos: FotoVehiculo[]
  vehiculoNombre: string
}

export function GaleriaFotos({ fotos, vehiculoNombre }: GaleriaFotosProps) {
  const [fotoActual, setFotoActual] = useState(0)

  if (fotos.length === 0) {
    return (
      <div className="aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm">Sin fotos disponibles</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Foto principal */}
      <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={fotos[fotoActual].url}
          alt={`${vehiculoNombre} - Foto ${fotoActual + 1}`}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {/* Contador de fotos */}
        <div className="absolute bottom-3 right-3 bg-negro/70 text-blanco px-3 py-1 rounded-full text-sm">
          {fotoActual + 1} / {fotos.length}
        </div>
      </div>

      {/* Miniaturas */}
      {fotos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {fotos.map((foto, index) => (
            <button
              key={foto.id}
              onClick={() => setFotoActual(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                index === fotoActual
                  ? 'border-red-500 ring-2 ring-red-200'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                src={foto.url}
                alt={`Miniatura ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

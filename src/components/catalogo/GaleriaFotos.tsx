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
        <span className="text-gray-400">Sin fotos</span>
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
        />
      </div>

      {/* Miniaturas */}
      {fotos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {fotos.map((foto, index) => (
            <button
              key={foto.id}
              onClick={() => setFotoActual(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                index === fotoActual
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                src={foto.url}
                alt={`Miniatura ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
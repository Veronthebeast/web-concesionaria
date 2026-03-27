'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Banner } from '@/lib/supabase/queries/banners'

interface CarrouselProps {
  banners: Banner[]
}

export function Carrousel({ banners }: CarrouselProps) {
  const [actual, setActual] = useState(0)

  useEffect(() => {
    if (banners.length <= 1) return

    const intervalo = setInterval(() => {
      setActual((prev) => (prev + 1) % banners.length)
    }, 5000)

    return () => clearInterval(intervalo)
  }, [banners.length])

  if (banners.length === 0) return null

  const banner = banners[actual]

  return (
    <div className="relative h-[400px] md:h-[500px] bg-gray-100 overflow-hidden">
      {/* Imagen */}
      <Link href={banner.enlace_url || '#'} className="block w-full h-full">
        <Image
          src={banner.imagen_url}
          alt={banner.titulo || 'Banner'}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Overlay con título */}
        {banner.titulo && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white">{banner.titulo}</h2>
            </div>
          </div>
        )}
      </Link>

      {/* Navegación con dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setActual(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === actual ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Ver slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Flechas de navegación */}
      {banners.length > 1 && (
        <>
          <button
            onClick={() => setActual((actual - 1 + banners.length) % banners.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors"
            aria-label="Anterior"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setActual((actual + 1) % banners.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white p-2 rounded-full transition-colors"
            aria-label="Siguiente"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  )
}

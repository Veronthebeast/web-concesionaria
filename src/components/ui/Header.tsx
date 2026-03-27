'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function Header() {
  const router = useRouter()
  const [busqueda, setBusqueda] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (busqueda.trim()) {
      router.push(`/catalogo?busqueda=${encodeURIComponent(busqueda.trim())}`)
    }
  }

  return (
    <header className="bg-blanco border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-xl font-bold text-negro">
              CONCESIONARIA
            </h1>
          </Link>

          {/* Buscador */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar vehículo..."
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Navegación */}
          <nav className="flex items-center gap-4">
            <Link href="/catalogo" className="text-gray-700 hover:text-red-600 font-medium text-sm">
              Catálogo
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

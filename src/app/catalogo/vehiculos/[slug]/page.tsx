import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getVehiculoPorSlug } from '@/lib/supabase/queries/vehiculos'
import { GaleriaFotos } from '@/components/catalogo/GaleriaFotos'
import { BotonWhatsApp } from '@/components/catalogo/BotonWhatsApp'

export const revalidate = 60

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const vehiculo = await getVehiculoPorSlug(slug)
  
  if (!vehiculo) {
    return { title: 'Vehículo no encontrado' }
  }

  const precioFormateado = vehiculo.moneda === 'USD' 
    ? `U$S ${vehiculo.precio.toLocaleString('es-AR')}`
    : `$ ${vehiculo.precio.toLocaleString('es-AR')}`

  return {
    title: `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.anio} — ${precioFormateado} | Concesionaria`,
    description: vehiculo.descripcion?.slice(0, 160) || `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.anio} en ${vehiculo.estado}`,
  }
}

function formatearKm(km: number): string {
  return km.toLocaleString('es-AR') + ' km'
}

function formatearPrecio(precio: number, moneda: string): string {
  if (moneda === 'USD') {
    return `U$S ${precio.toLocaleString('es-AR')}`
  }
  return `$ ${precio.toLocaleString('es-AR')}`
}

export default async function VehiculoPage({ params }: Props) {
  const { slug } = await params
  const vehiculo = await getVehiculoPorSlug(slug)

  if (!vehiculo) {
    notFound()
  }

  const nombreCompleto = `${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.version || ''}`.trim()
  const esVendido = vehiculo.estado === 'vendido'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blanco border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <a href="/" className="text-red-600 hover:text-red-700 flex items-center gap-2 font-medium">
            ← Volver al catálogo
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner vendido */}
        {esVendido && (
          <div className="bg-negro text-white text-center py-3 px-4 rounded-lg mb-6">
            <p className="font-semibold">Este vehículo ya fue vendido</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Galería */}
          <div>
            <GaleriaFotos fotos={vehiculo.fotos} vehiculoNombre={nombreCompleto} />
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Título y badges */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm font-medium">
                  {vehiculo.tipo === 'auto' ? 'Auto' : 'Moto'}
                </span>
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  vehiculo.estado === 'disponible' ? 'bg-green-100 text-green-700' :
                  vehiculo.estado === 'reservado' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {vehiculo.estado.charAt(0).toUpperCase() + vehiculo.estado.slice(1)}
                </span>
                {vehiculo.financiacion && (
                  <span className="px-3 py-1 bg-red-50 text-red-700 rounded text-sm font-medium">
                    Financiación disponible
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-negro">{nombreCompleto}</h1>
            </div>

            {/* Precio */}
            <div className="bg-red-50 border border-red-100 p-5 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Precio</p>
              <p className="text-4xl font-bold text-red-600">
                {formatearPrecio(vehiculo.precio, vehiculo.moneda)}
              </p>
            </div>

            {/* Ficha técnica */}
            <div className="bg-blanco rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-negro mb-4">Detalles</h2>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">Año</dt>
                  <dd className="font-medium text-negro">{vehiculo.anio}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Kilómetros</dt>
                  <dd className="font-medium text-negro">{formatearKm(vehiculo.km)}</dd>
                </div>
                {vehiculo.color && (
                  <div>
                    <dt className="text-sm text-gray-500">Color</dt>
                    <dd className="font-medium text-negro">{vehiculo.color}</dd>
                  </div>
                )}
                {vehiculo.combustible && (
                  <div>
                    <dt className="text-sm text-gray-500">Combustible</dt>
                    <dd className="font-medium text-negro capitalize">{vehiculo.combustible}</dd>
                  </div>
                )}
                {vehiculo.transmision && (
                  <div>
                    <dt className="text-sm text-gray-500">Transmisión</dt>
                    <dd className="font-medium text-negro capitalize">{vehiculo.transmision}</dd>
                  </div>
                )}
                {vehiculo.puertas && (
                  <div>
                    <dt className="text-sm text-gray-500">Puertas</dt>
                    <dd className="font-medium text-negro">{vehiculo.puertas}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Descripción */}
            {vehiculo.descripcion && (
              <div className="bg-blanco rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-negro mb-2">Descripción</h2>
                <p className="text-gray-600 whitespace-pre-line">{vehiculo.descripcion}</p>
              </div>
            )}

            {/* CTA WhatsApp */}
            {!esVendido && (
              <BotonWhatsApp vehiculo={vehiculo} className="w-full text-lg" />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

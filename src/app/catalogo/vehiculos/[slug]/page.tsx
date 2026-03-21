import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getVehiculoPorSlug } from '@/lib/supabase/queries/vehiculos'
import { GaleriaFotos } from '@/components/catalogo/GaleriaFotos'
import { BotonWhatsApp } from '@/components/catalogo/BotonWhatsApp'
import { Badge } from '@/components/ui/Badge'

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
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <a href="/" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
            ← Volver al catálogo
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner vendido */}
        {esVendido && (
          <div className="bg-gray-900 text-white text-center py-3 px-4 rounded-lg mb-6">
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
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="default">{vehiculo.tipo === 'auto' ? 'Auto' : 'Moto'}</Badge>
                <Badge variant="estado" estado={vehiculo.estado}>
                  {vehiculo.estado.charAt(0).toUpperCase() + vehiculo.estado.slice(1)}
                </Badge>
                {vehiculo.financiacion && <Badge variant="success">Financiación disponible</Badge>}
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{nombreCompleto}</h1>
            </div>

            {/* Precio */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Precio</p>
              <p className="text-4xl font-bold text-blue-600">
                {formatearPrecio(vehiculo.precio, vehiculo.moneda)}
              </p>
            </div>

            {/* Ficha técnica */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Ficha técnica</h2>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">Año</dt>
                  <dd className="font-medium text-gray-900">{vehiculo.anio}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Kilómetros</dt>
                  <dd className="font-medium text-gray-900">{formatearKm(vehiculo.km)}</dd>
                </div>
                {vehiculo.color && (
                  <div>
                    <dt className="text-sm text-gray-500">Color</dt>
                    <dd className="font-medium text-gray-900">{vehiculo.color}</dd>
                  </div>
                )}
                {vehiculo.combustible && (
                  <div>
                    <dt className="text-sm text-gray-500">Combustible</dt>
                    <dd className="font-medium text-gray-900 capitalize">{vehiculo.combustible}</dd>
                  </div>
                )}
                {vehiculo.transmision && (
                  <div>
                    <dt className="text-sm text-gray-500">Transmisión</dt>
                    <dd className="font-medium text-gray-900 capitalize">{vehiculo.transmision}</dd>
                  </div>
                )}
                {vehiculo.puertas && (
                  <div>
                    <dt className="text-sm text-gray-500">Puertas</dt>
                    <dd className="font-medium text-gray-900">{vehiculo.puertas}</dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Descripción */}
            {vehiculo.descripcion && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Descripción</h2>
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
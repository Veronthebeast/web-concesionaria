import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Vehículo no encontrado</h2>
        <p className="text-gray-600 mb-6">
          Este vehículo puede haber sido vendido o ya no está disponible.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg"
        >
          Volver al catálogo
        </Link>
      </div>
    </div>
  )
}
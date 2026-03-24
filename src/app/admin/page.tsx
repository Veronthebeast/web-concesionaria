import { createClient } from '@/lib/supabase/server'

export const revalidate = 0

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <div>No autorizado</div>
  }

  // Métricas
  const { data: vehiculos } = await supabase.from('vehiculos').select('estado, tipo')

  const total = vehiculos?.length || 0
  const disponibles = vehiculos?.filter(v => v.estado === 'disponible').length || 0
  const reservados = vehiculos?.filter(v => v.estado === 'reservado').length || 0
  const vendidos = vehiculos?.filter(v => v.estado === 'vendido').length || 0
  const autos = vehiculos?.filter(v => v.tipo === 'auto').length || 0
  const motos = vehiculos?.filter(v => v.tipo === 'moto').length || 0

  // Últimos 5 vehículos
  const { data: ultimos } = await supabase
    .from('vehiculos')
    .select('id, marca, modelo, anio, estado, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total vehículos</p>
          <p className="text-3xl font-bold">{total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Disponibles</p>
          <p className="text-3xl font-bold text-green-600">{disponibles}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Reservados</p>
          <p className="text-3xl font-bold text-yellow-600">{reservados}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Vendidos</p>
          <p className="text-3xl font-bold text-gray-600">{vendidos}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Autos</p>
          <p className="text-2xl font-bold">{autos}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Motos</p>
          <p className="text-2xl font-bold">{motos}</p>
        </div>
      </div>

      {/* Últimos */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="font-semibold mb-4">Últimos vehículos agregados</h2>
        {ultimos && ultimos.length > 0 ? (
          <ul className="space-y-2">
            {ultimos.map(v => (
              <li key={v.id} className="flex justify-between items-center border-b pb-2">
                <span>{v.marca} {v.modelo} ({v.anio})</span>
                <span className="text-sm capitalize text-gray-500">{v.estado}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No hay vehículos</p>
        )}
        <div className="mt-4">
          <a href="/admin/vehiculos" className="text-blue-600 hover:text-blue-800">
            Ver todos →
          </a>
        </div>
      </div>
    </div>
  )
}

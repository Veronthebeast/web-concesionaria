import { createClient } from '@/lib/supabase/server'
import { toggleDestacado, toggleActivo, eliminarVehiculo } from '@/app/admin/actions'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'

export const revalidate = 0 // Dynamic

export default async function AdminVehiculosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return <div className="p-8">No autorizado</div>
  }

  const { data: vehiculos } = await supabase
    .from('vehiculos')
    .select('*')
    .order('created_at', { ascending: false })

  // Obtener foto principal de cada vehículo
  const vehiculosConFotos = await Promise.all(
    (vehiculos || []).map(async (v) => {
      const { data: fotos } = await supabase
        .from('fotos_vehiculo')
        .select('url')
        .eq('vehiculo_id', v.id)
        .eq('orden', 0)
        .limit(1)
      return { ...v, fotoPrincipal: fotos?.[0]?.url || null }
    })
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vehículos</h1>
        <Link
          href="/admin/vehiculos/nuevo"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Nuevo vehículo
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Foto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehículo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destacado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehiculosConFotos.map((vehiculo) => (
              <tr key={vehiculo.id}>
                <td className="px-6 py-4">
                  <div className="w-16 h-12 relative bg-gray-100 rounded overflow-hidden">
                    {vehiculo.fotoPrincipal ? (
                      <Image src={vehiculo.fotoPrincipal} alt="" fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                        Sin foto
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">
                    {vehiculo.marca} {vehiculo.modelo}
                  </div>
                  <div className="text-sm text-gray-500">
                    {vehiculo.anio} • {vehiculo.tipo}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium">
                    {vehiculo.moneda === 'USD' ? 'U$S' : '$'} {vehiculo.precio.toLocaleString('es-AR')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="estado" estado={vehiculo.estado}>
                    {vehiculo.estado}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <form action={toggleDestacado.bind(null, vehiculo.id, !vehiculo.destacado)}>
                    <button className={`w-12 h-6 rounded-full transition-colors ${vehiculo.destacado ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <span className={`block w-4 h-4 bg-white rounded-full transform transition-transform ${vehiculo.destacado ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </form>
                </td>
                <td className="px-6 py-4">
                  <form action={toggleActivo.bind(null, vehiculo.id, !vehiculo.activo)}>
                    <button className={`w-12 h-6 rounded-full transition-colors ${vehiculo.activo ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <span className={`block w-4 h-4 bg-white rounded-full transform transition-transform ${vehiculo.activo ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </form>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Link href={`/admin/vehiculos/${vehiculo.id}/editar`} className="text-blue-600 hover:text-blue-800">
                      Editar
                    </Link>
                    <Link href={`/vehiculos/${vehiculo.slug}`} target="_blank" className="text-gray-600 hover:text-gray-800">
                      Ver
                    </Link>
                    <form action={eliminarVehiculo.bind(null, vehiculo.id)} onSubmit={(e) => { if (!confirm('¿Eliminar vehículo?')) e.preventDefault() }}>
                      <button className="text-red-600 hover:text-red-800">Eliminar</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {vehiculosConFotos.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No hay vehículos cargados. ¡Cargá el primero!
          </div>
        )}
      </div>
    </div>
  )
}

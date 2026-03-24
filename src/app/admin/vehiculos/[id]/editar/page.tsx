import { createClient } from '@/lib/supabase/server'
import { actualizarVehiculo } from '@/app/admin/actions'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditarVehiculoPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: vehiculo } = await supabase
    .from('vehiculos')
    .select('*')
    .eq('id', id)
    .single()

  if (!vehiculo) {
    notFound()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Editar Vehículo</h1>
      
      <form action={actualizarVehiculo.bind(null, id)} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Datos principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
            <select name="tipo" required defaultValue={vehiculo.tipo} className="w-full border rounded px-3 py-2">
              <option value="auto">Auto</option>
              <option value="moto">Moto</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marca *</label>
            <input type="text" name="marca" required defaultValue={vehiculo.marca} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modelo *</label>
            <input type="text" name="modelo" required defaultValue={vehiculo.modelo} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Año *</label>
            <input type="number" name="anio" required defaultValue={vehiculo.anio} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kilómetros *</label>
            <input type="number" name="km" required defaultValue={vehiculo.km} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
            <input type="number" name="precio" required defaultValue={vehiculo.precio} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Moneda *</label>
            <select name="moneda" required defaultValue={vehiculo.moneda} className="w-full border rounded px-3 py-2">
              <option value="ARS">ARS</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>

        {/* Datos adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Versión</label>
            <input type="text" name="version" defaultValue={vehiculo.version || ''} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <input type="text" name="color" defaultValue={vehiculo.color || ''} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Combustible</label>
            <select name="combustible" defaultValue={vehiculo.combustible || ''} className="w-full border rounded px-3 py-2">
              <option value="">Seleccionar</option>
              <option value="nafta">Nafta</option>
              <option value="diesel">Diesel</option>
              <option value="gnc">GNC</option>
              <option value="electrico">Eléctrico</option>
              <option value="hibrido">Híbrido</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Transmisión</label>
            <select name="transmision" defaultValue={vehiculo.transmision || ''} className="w-full border rounded px-3 py-2">
              <option value="">Seleccionar</option>
              <option value="manual">Manual</option>
              <option value="automatica">Automática</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Puertas</label>
            <select name="puertas" defaultValue={vehiculo.puertas || ''} className="w-full border rounded px-3 py-2">
              <option value="">Seleccionar</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea name="descripcion" rows={4} defaultValue={vehiculo.descripcion || ''} className="w-full border rounded px-3 py-2" />
        </div>

        {/* Estado y config */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
            <select name="estado" required defaultValue={vehiculo.estado} className="w-full border rounded px-3 py-2">
              <option value="disponible">Disponible</option>
              <option value="reservado">Reservado</option>
              <option value="vendido">Vendido</option>
            </select>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input type="checkbox" name="destacado" value="true" defaultChecked={vehiculo.destacado} id="destacado" className="w-4 h-4" />
            <label htmlFor="destacado" className="text-sm text-gray-700">Destacado</label>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input type="checkbox" name="financiacion" value="true" defaultChecked={vehiculo.financiacion} id="financiacion" className="w-4 h-4" />
            <label htmlFor="financiacion" className="text-sm text-gray-700">Financiación</label>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-4 pt-4">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Guardar cambios
          </button>
          <a href="/admin/vehiculos" className="px-6 py-2 border rounded hover:bg-gray-50">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  )
}

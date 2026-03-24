import { crearVehiculo } from '@/app/admin/actions'

export default function NuevoVehiculoPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nuevo Vehículo</h1>
      
      <form action={crearVehiculo} className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Datos principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
            <select name="tipo" required className="w-full border rounded px-3 py-2">
              <option value="auto">Auto</option>
              <option value="moto">Moto</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marca *</label>
            <input type="text" name="marca" required className="w-full border rounded px-3 py-2" placeholder="Ford, Honda, etc." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modelo *</label>
            <input type="text" name="modelo" required className="w-full border rounded px-3 py-2" placeholder="Focus, Civic, etc." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Año *</label>
            <input type="number" name="anio" required min="1990" max="2030" className="w-full border rounded px-3 py-2" placeholder="2023" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kilómetros *</label>
            <input type="number" name="km" required min="0" className="w-full border rounded px-3 py-2" placeholder="45000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
            <input type="number" name="precio" required min="0" step="0.01" className="w-full border rounded px-3 py-2" placeholder="15000000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Moneda *</label>
            <select name="moneda" required className="w-full border rounded px-3 py-2">
              <option value="ARS">ARS - Pesos</option>
              <option value="USD">USD - Dólares</option>
            </select>
          </div>
        </div>

        {/* Datos adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Versión</label>
            <input type="text" name="version" className="w-full border rounded px-3 py-2" placeholder="SE Plus, Sport, etc." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <input type="text" name="color" className="w-full border rounded px-3 py-2" placeholder="Negro, Blanco, etc." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Combustible</label>
            <select name="combustible" className="w-full border rounded px-3 py-2">
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
            <select name="transmision" className="w-full border rounded px-3 py-2">
              <option value="">Seleccionar</option>
              <option value="manual">Manual</option>
              <option value="automatica">Automática</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Puertas</label>
            <select name="puertas" className="w-full border rounded px-3 py-2">
              <option value="">Seleccionar</option>
              <option value="2">2 puertas</option>
              <option value="3">3 puertas</option>
              <option value="4">4 puertas</option>
              <option value="5">5 puertas</option>
            </select>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea name="descripcion" rows={4} className="w-full border rounded px-3 py-2" placeholder="Descripción adicional del vehículo..." />
        </div>

        {/* Estado y configuración */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
            <select name="estado" required className="w-full border rounded px-3 py-2">
              <option value="disponible">Disponible</option>
              <option value="reservado">Reservado</option>
              <option value="vendido">Vendido</option>
            </select>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input type="checkbox" name="destacado" value="true" id="destacado" className="w-4 h-4" />
            <label htmlFor="destacado" className="text-sm text-gray-700">Destacado (en home)</label>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input type="checkbox" name="financiacion" value="true" id="financiacion" className="w-4 h-4" />
            <label htmlFor="financiacion" className="text-sm text-gray-700">Financiación disponible</label>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-4 pt-4">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Guardar vehículo
          </button>
          <a href="/admin/vehiculos" className="px-6 py-2 border rounded hover:bg-gray-50">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  )
}

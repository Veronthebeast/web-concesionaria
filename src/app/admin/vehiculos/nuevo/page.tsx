export default function NuevoVehiculoPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Nuevo Vehículo</h2>
      <form className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select className="w-full border rounded px-3 py-2">
              <option value="auto">Auto</option>
              <option value="moto">Moto</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
            <input type="text" className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
            <input type="text" className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
            <input type="number" className="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <div className="flex gap-4">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Guardar
          </button>
          <a href="/admin/vehiculos" className="px-6 py-2 border rounded hover:bg-gray-50">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}

export default function EditarVehiculoPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Editar Vehículo</h2>
      <form className="bg-white rounded-lg shadow p-6 space-y-4">
        <p className="text-gray-500">Formulario de edición (ID: dinámico)</p>
        <div className="flex gap-4">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Guardar cambios
          </button>
          <a href="/admin/vehiculos" className="px-6 py-2 border rounded hover:bg-gray-50">
            Cancelar
          </a>
        </div>
      </form>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Total</p>
          <p className="text-2xl font-bold">-</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Disponibles</p>
          <p className="text-2xl font-bold text-green-600">-</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Reservados</p>
          <p className="text-2xl font-bold text-yellow-600">-</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Vendidos</p>
          <p className="text-2xl font-bold text-blue-600">-</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Autos</p>
          <p className="text-2xl font-bold">-</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-gray-500 text-sm">Motos</p>
          <p className="text-2xl font-bold">-</p>
        </div>
      </div>
    </div>
  );
}

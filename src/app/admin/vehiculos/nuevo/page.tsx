import { crearVehiculoConFotos } from '../actions'
import { FormularioVehiculo } from '@/components/admin/FormularioVehiculo'

export default function NuevoVehiculoPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nuevo Vehículo</h1>
      <FormularioVehiculo action={crearVehiculoConFotos} />
    </div>
  )
}

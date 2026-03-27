import { getVehiculos, getMarcasDisponibles } from '@/lib/supabase/queries/vehiculos'
import { CatalogoContent } from './CatalogoContent'

export const revalidate = 60

interface Props {
  searchParams: Promise<{ busqueda?: string }>
}

export default async function CatalogoPage({ searchParams }: Props) {
  const params = await searchParams
  const [vehiculos, marcas] = await Promise.all([
    getVehiculos(),
    getMarcasDisponibles()
  ])

  return <CatalogoContent vehiculos={vehiculos} marcas={marcas} busquedaInicial={params.busqueda} />
}

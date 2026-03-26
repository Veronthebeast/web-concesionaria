'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function crearVehiculoConFotos(formData: FormData) {
  const cookieStore = await cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {},
      },
    }
  )
  
  // Verificar auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')
  
  // Extraer datos del formData
  const data = {
    tipo: formData.get('tipo') as string,
    marca: formData.get('marca') as string,
    modelo: formData.get('modelo') as string,
    anio: parseInt(formData.get('anio') as string),
    km: parseInt(formData.get('km') as string),
    precio: parseFloat(formData.get('precio') as string),
    moneda: formData.get('moneda') as string,
    version: formData.get('version') as string || null,
    color: formData.get('color') as string || null,
    combustible: formData.get('combustible') as string || null,
    transmision: formData.get('transmision') as string || null,
    puertas: formData.get('puertas') ? parseInt(formData.get('puertas') as string) : null,
    descripcion: formData.get('descripcion') as string || null,
    estado: formData.get('estado') as string,
    destacado: formData.get('destacado') === 'true',
    financiacion: formData.get('financiacion') === 'true',
  }
  
  // Crear vehículo
  const { data: vehiculo, error } = await supabase
    .from('vehiculos')
    .insert({
      ...data,
      slug: '',
    })
    .select()
    .single()
  
  if (error) throw new Error(error.message)
  
  // Generar slug
  const slug = `${data.marca}-${data.modelo}-${data.anio}-${vehiculo.id.slice(0, 4)}`.toLowerCase().replace(/\s+/g, '-')
  await supabase.from('vehiculos').update({ slug }).eq('id', vehiculo.id)
  
  // Buscar fotos subidas temporalmente (si las hay)
  // Por ahora simplificado - las fotos se agregan después
  
  revalidatePath('/admin/vehiculos')
  revalidatePath('/')
  redirect('/admin/vehiculos')
}

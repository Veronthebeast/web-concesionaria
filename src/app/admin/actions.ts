'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// Helper para generar slug
function generarSlug(marca: string, modelo: string, anio: number, id: string): string {
  const base = `${marca}-${modelo}-${anio}`.toLowerCase().replace(/\s+/g, '-')
  const suffix = id.slice(0, 4)
  return `${base}-${suffix}`
}

// Crear vehículo
export async function crearVehiculo(formData: FormData) {
  const supabase = await createClient()
  
  // Verificar auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('No autorizado')
  }

  // Extraer datos
  const tipo = formData.get('tipo') as string
  const marca = formData.get('marca') as string
  const modelo = formData.get('modelo') as string
  const anio = parseInt(formData.get('anio') as string)
  const km = parseInt(formData.get('km') as string)
  const precio = parseFloat(formData.get('precio') as string)
  const moneda = formData.get('moneda') as string
  const version = formData.get('version') as string || null
  const color = formData.get('color') as string || null
  const combustible = formData.get('combustible') as string || null
  const transmision = formData.get('transmision') as string || null
  const puertas = formData.get('puertas') ? parseInt(formData.get('puertas') as string) : null
  const descripcion = formData.get('descripcion') as string || null
  const estado = formData.get('estado') as string
  const destacado = formData.get('destacado') === 'true'
  const financiacion = formData.get('financiacion') === 'true'

  // Insertar
  const { data, error } = await supabase
    .from('vehiculos')
    .insert({
      tipo,
      marca,
      modelo,
      anio,
      km,
      precio,
      moneda,
      version,
      color,
      combustible,
      transmision,
      puertas,
      descripcion,
      estado,
      destacado,
      financiacion,
      slug: '', // se actualiza después
    })
    .select()
    .single()

  if (error) {
    console.error('Error creando vehículo:', error)
    throw new Error(error.message)
  }

  // Generar slug
  const slug = generarSlug(marca, modelo, anio, data.id)
  await supabase
    .from('vehiculos')
    .update({ slug })
    .eq('id', data.id)

  revalidatePath('/admin/vehiculos')
  revalidatePath('/')
  redirect('/admin/vehiculos')
}

// Actualizar vehículo
export async function actualizarVehiculo(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('No autorizado')
  }

  const tipo = formData.get('tipo') as string
  const marca = formData.get('marca') as string
  const modelo = formData.get('modelo') as string
  const anio = parseInt(formData.get('anio') as string)
  const km = parseInt(formData.get('km') as string)
  const precio = parseFloat(formData.get('precio') as string)
  const moneda = formData.get('moneda') as string
  const version = formData.get('version') as string || null
  const color = formData.get('color') as string || null
  const combustible = formData.get('combustible') as string || null
  const transmision = formData.get('transmision') as string || null
  const puertas = formData.get('puertas') ? parseInt(formData.get('puertas') as string) : null
  const descripcion = formData.get('descripcion') as string || null
  const estado = formData.get('estado') as string
  const destacado = formData.get('destacado') === 'true'
  const financiacion = formData.get('financiacion') === 'true'

  const { error } = await supabase
    .from('vehiculos')
    .update({
      tipo,
      marca,
      modelo,
      anio,
      km,
      precio,
      moneda,
      version,
      color,
      combustible,
      transmision,
      puertas,
      descripcion,
      estado,
      destacado,
      financiacion,
    })
    .eq('id', id)

  if (error) {
    console.error('Error actualizando:', error)
    throw new Error(error.message)
  }

  revalidatePath('/admin/vehiculos')
  revalidatePath('/')
  revalidatePath(`/vehiculos/${id}`)
  redirect('/admin/vehiculos')
}

// Toggle destacado
export async function toggleDestacado(id: string, destacado: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')

  await supabase.from('vehiculos').update({ destacado }).eq('id', id)
  revalidatePath('/admin/vehiculos')
  revalidatePath('/')
}

// Toggle activo
export async function toggleActivo(id: string, activo: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')

  await supabase.from('vehiculos').update({ activo }).eq('id', id)
  revalidatePath('/admin/vehiculos')
  revalidatePath('/')
}

// Eliminar vehículo
export async function eliminarVehiculo(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autorizado')

  // Primero eliminar fotos del storage
  const { data: fotos } = await supabase
    .from('fotos_vehiculo')
    .select('storage_path')
    .eq('vehiculo_id', id)

  if (fotos && fotos.length > 0) {
    for (const foto of fotos) {
      await supabase.storage.from('vehiculos-fotos').remove([foto.storage_path])
    }
  }

  // Eliminar de DB (las fotos se eliminan por cascade)
  await supabase.from('vehiculos').delete().eq('id', id)
  
  revalidatePath('/admin/vehiculos')
  revalidatePath('/')
}

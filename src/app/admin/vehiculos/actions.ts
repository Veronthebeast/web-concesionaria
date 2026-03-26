'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

interface Foto {
  url: string
  storagePath: string
}

export async function crearVehiculoConFotos(
  data: {
    tipo: string
    marca: string
    modelo: string
    anio: string
    km: string
    precio: string
    moneda: string
    version: string
    color: string
    combustible: string
    transmision: string
    puertas: string
    descripcion: string
    estado: string
    destacado: boolean
    financiacion: boolean
    activo: boolean
  },
  fotos: Foto[]
) {
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
  
  // Crear vehículo
  const { data: vehiculo, error } = await supabase
    .from('vehiculos')
    .insert({
      tipo: data.tipo,
      marca: data.marca,
      modelo: data.modelo,
      anio: parseInt(data.anio),
      km: parseInt(data.km),
      precio: parseFloat(data.precio),
      moneda: data.moneda,
      version: data.version || null,
      color: data.color || null,
      combustible: data.combustible || null,
      transmision: data.transmision || null,
      puertas: data.puertas ? parseInt(data.puertas) : null,
      descripcion: data.descripcion || null,
      estado: data.estado,
      destacado: data.destacado,
      financiacion: data.financiacion,
      activo: data.activo,
      slug: '',
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error creating vehiculo:', error)
    throw new Error(error.message)
  }
  
  // Generar slug
  const slug = `${data.marca}-${data.modelo}-${data.anio}-${vehiculo.id.slice(0, 4)}`.toLowerCase().replace(/\s+/g, '-')
  await supabase.from('vehiculos').update({ slug }).eq('id', vehiculo.id)
  
  // Guardar fotos en la base de datos
  if (fotos && fotos.length > 0) {
    const fotosData = fotos.map((foto, index) => ({
      vehiculo_id: vehiculo.id,
      url: foto.url,
      storage_path: foto.storagePath,
      orden: index
    }))
    
    const { error: fotosError } = await supabase
      .from('fotos_vehiculo')
      .insert(fotosData)
    
    if (fotosError) {
      console.error('Error saving fotos:', fotosError)
    }
  }
  
  revalidatePath('/admin/vehiculos')
  revalidatePath('/')
  redirect('/admin/vehiculos')
}

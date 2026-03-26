'use server'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

interface Foto {
  url: string
  storagePath: string
}

export async function crearVehiculoConFotos(formData: FormData, fotos: Foto[]) {
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
    anio: formData.get('anio') as string,
    km: formData.get('km') as string,
    precio: formData.get('precio') as string,
    moneda: formData.get('moneda') as string,
    version: formData.get('version') as string,
    color: formData.get('color') as string,
    combustible: formData.get('combustible') as string,
    transmision: formData.get('transmision') as string,
    puertas: formData.get('puertas') as string,
    descripcion: formData.get('descripcion') as string,
    estado: formData.get('estado') as string,
    destacado: formData.get('destacado') === 'true',
    financiacion: formData.get('financiacion') === 'true',
    activo: formData.get('activo') === 'true',
  }
  
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
      activo: data.activo ?? true,
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

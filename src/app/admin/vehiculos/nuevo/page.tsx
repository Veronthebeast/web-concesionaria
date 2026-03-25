import { FormularioVehiculo } from '@/components/admin/FormularioVehiculo'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

async function getServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return [] },
        setAll() {},
      },
    }
  )
}

export default async function NuevoVehiculoPage() {
  const handleSubmit = async (data: any, fotos: any[]) => {
    'use server'
    
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
        slug: '',
      })
      .select()
      .single()
    
    if (error) throw new Error(error.message)
    
    // Generar slug
    const slug = `${data.marca}-${data.modelo}-${data.anio}-${vehiculo.id.slice(0, 4)}`.toLowerCase().replace(/\s+/g, '-')
    await supabase.from('vehiculos').update({ slug }).eq('id', vehiculo.id)
    
    // Subir fotos si hay
    if (fotos.length > 0) {
      const serviceClient = await getServiceClient()
      
      for (let i = 0; i < fotos.length; i++) {
        const foto = fotos[i]
        if (!foto.archivo) continue
        
        const ext = foto.archivo.name.split('.').pop()
        const fileName = `${vehiculo.id}/${Date.now()}-${i}.${ext}`
        
        const buffer = await foto.archivo.arrayBuffer()
        
        const { error: uploadError } = await serviceClient.storage
          .from('vehiculos-fotos')
          .upload(fileName, buffer, {
            contentType: foto.archivo.type,
            upsert: false
          })
        
        if (uploadError) {
          console.error('Error uploading foto:', uploadError)
          continue
        }
        
        const { data: urlData } = serviceClient.storage
          .from('vehiculos-fotos')
          .getPublicUrl(fileName)
        
        await supabase.from('fotos_vehiculo').insert({
          vehiculo_id: vehiculo.id,
          url: urlData.publicUrl,
          storage_path: fileName,
          orden: i
        })
      }
    }
    
    revalidatePath('/admin/vehiculos')
    revalidatePath('/')
    redirect('/admin/vehiculos')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Nuevo Vehículo</h1>
      <FormularioVehiculo onSubmit={handleSubmit} />
    </div>
  )
}

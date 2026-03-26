import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  console.log('Upload API called')
  
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided', code: 'NO_FILE' }, { status: 400 })
    }

    // Validar tipo
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type', code: 'INVALID_TYPE' }, { status: 400 })
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB)', code: 'FILE_TOO_LARGE' }, { status: 400 })
    }

    // Verificar que la service key esté configurada
    const serviceKey = process.env.SUPABASE_SERVICE_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    
    if (!serviceKey || !supabaseUrl) {
      console.error('Missing env vars:', { serviceKey: !!serviceKey, supabaseUrl: !!supabaseUrl })
      return NextResponse.json({ error: 'Server configuration error', code: 'NO_SERVICE_KEY' }, { status: 500 })
    }

    console.log('Creating supabase client')

    // Crear cliente de servicio para upload
    const supabase = createClient(supabaseUrl, serviceKey)

    // Verificar bucket existe
    console.log('Checking bucket')
    const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('vehiculos-fotos')
    
    if (bucketError) {
      console.error('Bucket error:', bucketError)
      // Crear bucket si no existe
      const { error: createError } = await supabase.storage.createBucket('vehiculos-fotos', { public: true })
      if (createError) {
        console.error('Create bucket error:', createError)
      }
    }

    // Generar nombre de archivo
    const ext = file.name.split('.').pop()
    const fileName = `temp/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    // Convertir a array buffer
    const buffer = await file.arrayBuffer()
    const bytes = new Uint8Array(buffer)

    console.log('Uploading file:', fileName)

    // Subir a storage
    const { data, error } = await supabase.storage
      .from('vehiculos-fotos')
      .upload(fileName, bytes, {
        contentType: file.type,
        upsert: false
      })

    if (error) {
      console.error('Storage error:', error)
      return NextResponse.json({ error: error.message, code: 'STORAGE_ERROR' }, { status: 500 })
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('vehiculos-fotos')
      .getPublicUrl(fileName)

    console.log('Upload success:', urlData.publicUrl)

    return NextResponse.json({ 
      url: urlData.publicUrl, 
      storagePath: fileName 
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: String(error), code: 'UNKNOWN' }, { status: 500 })
  }
}

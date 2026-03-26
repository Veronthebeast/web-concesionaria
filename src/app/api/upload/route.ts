import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const vehiculoId = formData.get('vehiculoId') as string | null

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
    if (!process.env.SUPABASE_SERVICE_KEY) {
      console.error('SUPABASE_SERVICE_KEY no configurada')
      return NextResponse.json({ error: 'Server configuration error', code: 'NO_SERVICE_KEY' }, { status: 500 })
    }

    // Crear cliente de servicio para upload (sin auth)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!
    )

    // Generar nombre de archivo
    const ext = file.name.split('.').pop()
    const fileName = `${vehiculoId || 'temp'}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    // Convertir a array buffer
    const buffer = await file.arrayBuffer()
    const bytes = new Uint8Array(buffer)

    // Subir a storage (ignorar políticas RLS)
    const { data, error } = await supabase.storage
      .from('vehiculos-fotos')
      .upload(fileName, bytes, {
        contentType: file.type,
        upsert: false
      })

    if (error) {
      console.error('Storage error:', error)
      return NextResponse.json({ error: 'Storage error', code: 'STORAGE_ERROR' }, { status: 500 })
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('vehiculos-fotos')
      .getPublicUrl(fileName)

    return NextResponse.json({ 
      url: urlData.publicUrl, 
      storagePath: fileName 
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed', code: 'UNKNOWN' }, { status: 500 })
  }
}

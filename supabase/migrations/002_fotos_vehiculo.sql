-- Tabla fotos_vehiculo
CREATE TABLE IF NOT EXISTS fotos_vehiculo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehiculo_id UUID NOT NULL REFERENCES vehiculos(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  orden INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índice
CREATE INDEX idx_fotos_vehiculo_vehiculo_id ON fotos_vehiculo(vehiculo_id);

-- RLS
ALTER TABLE fotos_vehiculo ENABLE ROW LEVEL SECURITY;

-- Lectura pública
CREATE POLICY "fotos_public_read" ON fotos_vehiculo
  FOR SELECT USING (true);

-- Escritura: solo admin
CREATE POLICY "fotos_admin_all" ON fotos_vehiculo
  FOR ALL USING (auth.role() = 'authenticated');

-- Bucket público para fotos de vehículos
INSERT INTO storage.buckets (id, name, public)
VALUES ('vehiculos-fotos', 'vehiculos-fotos', true)
ON CONFLICT (id) DO NOTHING;

-- Política de lectura del bucket (público)
CREATE POLICY "vehiculos_fotos_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'vehiculos-fotos');

-- Política de escritura del bucket (solo auth)
CREATE POLICY "vehiculos_fotos_auth_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'vehiculos-fotos' AND
    auth.role() = 'authenticated'
  );

-- Política de delete del bucket (solo auth)
CREATE POLICY "vehiculos_fotos_auth_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'vehiculos-fotos' AND
    auth.role() = 'authenticated'
  );

-- Tabla carousel_banners
CREATE TABLE IF NOT EXISTS carousel_banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT,
  imagen_url TEXT NOT NULL,
  enlace_url TEXT,
  orden INTEGER NOT NULL DEFAULT 0,
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índice
CREATE INDEX idx_carousel_banners_orden ON carousel_banners(orden);

-- RLS
ALTER TABLE carousel_banners ENABLE ROW LEVEL SECURITY;

-- Política de lectura pública
CREATE POLICY "banners_public_read" ON carousel_banners FOR SELECT USING (true);

-- Política de escritura para admin
CREATE POLICY "banners_admin_all" ON carousel_banners FOR ALL USING (auth.role() = 'authenticated');

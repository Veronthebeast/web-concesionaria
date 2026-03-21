-- Tabla vehiculos
CREATE TABLE IF NOT EXISTS vehiculos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL CHECK (tipo IN ('auto', 'moto')),
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  version TEXT,
  anio INTEGER NOT NULL CHECK (anio >= 1990 AND anio <= EXTRACT(YEAR FROM NOW()) + 1),
  km INTEGER NOT NULL DEFAULT 0,
  precio DECIMAL(12, 2) NOT NULL,
  moneda TEXT NOT NULL DEFAULT 'ARS' CHECK (moneda IN ('ARS', 'USD')),
  color TEXT,
  combustible TEXT CHECK (combustible IN ('nafta', 'diesel', 'gnc', 'electrico', 'hibrido')),
  transmision TEXT CHECK (transmision IN ('manual', 'automatica')),
  puertas INTEGER CHECK (puertas >= 2 AND puertas <= 5),
  descripcion TEXT,
  estado TEXT NOT NULL DEFAULT 'disponible' CHECK (estado IN ('disponible', 'reservado', 'vendido')),
  destacado BOOLEAN NOT NULL DEFAULT false,
  financiacion BOOLEAN NOT NULL DEFAULT false,
  slug TEXT UNIQUE NOT NULL,
  orden INTEGER NOT NULL DEFAULT 0,
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger para updated_at automático
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vehiculos_updated_at
  BEFORE UPDATE ON vehiculos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Índices
CREATE INDEX idx_vehiculos_tipo ON vehiculos(tipo);
CREATE INDEX idx_vehiculos_marca ON vehiculos(marca);
CREATE INDEX idx_vehiculos_estado ON vehiculos(estado);
CREATE INDEX idx_vehiculos_destacado ON vehiculos(destacado) WHERE destacado = true;
CREATE INDEX idx_vehiculos_activo ON vehiculos(activo) WHERE activo = true;
CREATE INDEX idx_vehiculos_slug ON vehiculos(slug);
CREATE INDEX idx_vehiculos_orden ON vehiculos(orden ASC);

-- RLS
ALTER TABLE vehiculos ENABLE ROW LEVEL SECURITY;

-- Lectura pública: solo activos
CREATE POLICY "vehiculos_public_read" ON vehiculos
  FOR SELECT USING (activo = true);

-- Escritura: solo admin autenticado
CREATE POLICY "vehiculos_admin_all" ON vehiculos
  FOR ALL USING (auth.role() = 'authenticated');

'use client'

import { FiltrosPanel } from '@/components/catalogo/FiltrosPanel'

interface FiltrosPanelClientProps {
  marcas: string[]
}

export function FiltrosPanelClient({ marcas }: FiltrosPanelClientProps) {
  return <FiltrosPanel marcas={marcas} />
}
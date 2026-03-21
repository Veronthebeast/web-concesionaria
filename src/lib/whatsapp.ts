import type { Vehiculo } from '@/types'

export function generarLinkWhatsApp(vehiculo: Vehiculo): string {
  const telefono = process.env.NEXT_PUBLIC_WA_TELEFONO || ''
  const mensaje = encodeURIComponent(
    `Hola! Me interesa el ${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.anio} que vi en tu página. ¿Está disponible?`
  )
  return `https://wa.me/${telefono}?text=${mensaje}`
}

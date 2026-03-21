import type { EstadoVehiculo } from '@/types'

interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'gray' | 'estado'
  estado?: EstadoVehiculo
  children: React.ReactNode
  className?: string
}

const variantClasses = {
  default: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  gray: 'bg-gray-100 text-gray-600',
  estado: {
    disponible: 'bg-green-100 text-green-800',
    reservado: 'bg-yellow-100 text-yellow-800',
    vendido: 'bg-gray-100 text-gray-600',
  }
}

export function Badge({ variant = 'default', estado, children, className = '' }: BadgeProps) {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
  
  let finalClassName = baseClasses
  if (variant === 'estado' && estado) {
    finalClassName += ' ' + variantClasses.estado[estado]
  } else {
    finalClassName += ' ' + variantClasses[variant]
  }
  
  return (
    <span className={`${finalClassName} ${className}`}>
      {children}
    </span>
  )
}
'use client'

import { useState } from 'react'
import { UploadFotos } from './UploadFotos'

interface FormData {
  tipo: string
  marca: string
  modelo: string
  anio: string
  km: string
  precio: string
  moneda: string
  version: string
  color: string
  combustible: string
  transmision: string
  puertas: string
  descripcion: string
  estado: string
  destacado: boolean
  financiacion: boolean
  activo: boolean
}

interface Foto {
  url: string
  archivo?: File
  id?: string
  eliminar?: boolean
}

export function FormularioVehiculo({ 
  vehiculo,
  onSubmit 
}: { 
  vehiculo?: FormData
  onSubmit: (data: FormData, fotos: Foto[]) => Promise<void>
}) {
  const [formData, setFormData] = useState<FormData>(vehiculo || {
    tipo: 'auto',
    marca: '',
    modelo: '',
    anio: '',
    km: '',
    precio: '',
    moneda: 'ARS',
    version: '',
    color: '',
    combustible: '',
    transmision: '',
    puertas: '',
    descripcion: '',
    estado: 'disponible',
    destacado: false,
    financiacion: false,
    activo: true
  })
  const [fotos, setFotos] = useState<Foto[]>([])
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnviando(true)
    setError('')

    try {
      await onSubmit(formData, fotos)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Fotos */}
      <div>
        <UploadFotos onFotosChange={setFotos} />
      </div>

      {/* Datos principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
          <select 
            name="tipo" 
            value={formData.tipo} 
            onChange={handleChange}
            required 
            className="w-full border rounded px-3 py-2"
          >
            <option value="auto">Auto</option>
            <option value="moto">Moto</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Marca *</label>
          <input 
            type="text" 
            name="marca" 
            value={formData.marca} 
            onChange={handleChange}
            required 
            className="w-full border rounded px-3 py-2" 
            placeholder="Ford, Honda, etc." 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Modelo *</label>
          <input 
            type="text" 
            name="modelo" 
            value={formData.modelo} 
            onChange={handleChange}
            required 
            className="w-full border rounded px-3 py-2" 
            placeholder="Focus, Civic, etc." 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Año *</label>
          <input 
            type="number" 
            name="anio" 
            value={formData.anio} 
            onChange={handleChange}
            required 
            min="1990" 
            max="2030" 
            className="w-full border rounded px-3 py-2" 
            placeholder="2023" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kilómetros *</label>
          <input 
            type="number" 
            name="km" 
            value={formData.km} 
            onChange={handleChange}
            required 
            min="0" 
            className="w-full border rounded px-3 py-2" 
            placeholder="45000" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Precio *</label>
          <input 
            type="number" 
            name="precio" 
            value={formData.precio} 
            onChange={handleChange}
            required 
            min="0" 
            step="0.01" 
            className="w-full border rounded px-3 py-2" 
            placeholder="15000000" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Moneda *</label>
          <select 
            name="moneda" 
            value={formData.moneda} 
            onChange={handleChange}
            required 
            className="w-full border rounded px-3 py-2"
          >
            <option value="ARS">ARS - Pesos</option>
            <option value="USD">USD - Dólares</option>
          </select>
        </div>
      </div>

      {/* Datos adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Versión</label>
          <input 
            type="text" 
            name="version" 
            value={formData.version} 
            onChange={handleChange}
            className="w-full border rounded px-3 py-2" 
            placeholder="SE Plus, Sport, etc." 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
          <input 
            type="text" 
            name="color" 
            value={formData.color} 
            onChange={handleChange}
            className="w-full border rounded px-3 py-2" 
            placeholder="Negro, Blanco, etc." 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Combustible</label>
          <select 
            name="combustible" 
            value={formData.combustible} 
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Seleccionar</option>
            <option value="nafta">Nafta</option>
            <option value="diesel">Diesel</option>
            <option value="gnc">GNC</option>
            <option value="electrico">Eléctrico</option>
            <option value="hibrido">Híbrido</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Transmisión</label>
          <select 
            name="transmision" 
            value={formData.transmision} 
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Seleccionar</option>
            <option value="manual">Manual</option>
            <option value="automatica">Automática</option>
          </select>
        </div>
        {formData.tipo === 'auto' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Puertas</label>
            <select 
              name="puertas" 
              value={formData.puertas} 
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Seleccionar</option>
              <option value="2">2 puertas</option>
              <option value="3">3 puertas</option>
              <option value="4">4 puertas</option>
              <option value="5">5 puertas</option>
            </select>
          </div>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea 
          name="descripcion" 
          value={formData.descripcion} 
          onChange={handleChange}
          rows={4} 
          className="w-full border rounded px-3 py-2" 
          placeholder="Descripción adicional del vehículo..." 
        />
      </div>

      {/* Estado y configuración */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
          <select 
            name="estado" 
            value={formData.estado} 
            onChange={handleChange}
            required 
            className="w-full border rounded px-3 py-2"
          >
            <option value="disponible">Disponible</option>
            <option value="reservado">Reservado</option>
            <option value="vendido">Vendido</option>
          </select>
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input 
            type="checkbox" 
            name="destacado" 
            checked={formData.destacado}
            onChange={handleChange}
            id="destacado" 
            className="w-4 h-4" 
          />
          <label htmlFor="destacado" className="text-sm text-gray-700">Destacado</label>
        </div>
        <div className="flex items-center gap-2 pt-6">
          <input 
            type="checkbox" 
            name="financiacion" 
            checked={formData.financiacion}
            onChange={handleChange}
            id="financiacion" 
            className="w-4 h-4" 
          />
          <label htmlFor="financiacion" className="text-sm text-gray-700">Financiación</label>
        </div>
        {vehiculo && (
          <div className="flex items-center gap-2 pt-6">
            <input 
              type="checkbox" 
              name="activo" 
              checked={formData.activo}
              onChange={handleChange}
              id="activo" 
              className="w-4 h-4" 
            />
            <label htmlFor="activo" className="text-sm text-gray-700">Activo</label>
          </div>
        )}
      </div>

      {/* Botones */}
      <div className="flex gap-4 pt-4">
        <button 
          type="submit" 
          disabled={enviando}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {enviando ? 'Guardando...' : vehiculo ? 'Guardar cambios' : 'Guardar vehículo'}
        </button>
        <a href="/admin/vehiculos" className="px-6 py-2 border rounded hover:bg-gray-50">
          Cancelar
        </a>
      </div>
    </form>
  )
}

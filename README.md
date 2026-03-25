# 🚗 Concesionaria Digital

Catálogo digital de vehículos para tu negocio. Los clientes pueden ver el stock, filtrar por características y contactarte directamente por WhatsApp.

## 🌐 Acceso

- **Sitio público:** https://web-concesionaria.vercel.app
- **Panel admin:** https://web-concesionaria.vercel.app/admin

## 📱 Cómo usar el panel admin

### Acceder al panel
1. Visitá https://web-concesionaria.vercel.app/admin
2. Iniciá sesión con tu email y contraseña
3. Si no tenés cuenta, pedile al desarrollador que te cree una

### Agregar un vehículo nuevo
1. En el panel admin, hacé clic en **"Nuevo Vehículo"**
2. Completá los datos:
   - **Tipo:** Auto o Moto
   - **Marca:** ej: Ford, Toyota, Honda
   - **Modelo:** ej: Focus, Corolla, CB500
   - **Año:** 4 dígitos (ej: 2019)
   - **Kilómetros:** número sin puntos
   - **Precio:** en pesos o dólares
   - **Descripción:** detalles extra que quieras agregar
3. Subí hasta 10 fotos del vehículo
4. Elegí el estado: Disponible / Reservado / Vendido
5. Opcional: activá "Destacado" para que aparezca en la home
6. Hacé clic en **"Guardar"**

### Editar un vehículo
1. En el listado de vehículos, hacé clic en **"Editar"** del vehículo que quieras modificar
2. Cambiá los datos que necesites
3. Hacé clic en **"Guardar cambios"**

### Cambiar el estado de un vehículo
En el listado de vehículos del admin:
- **Disponible:** verde — se muestra en el catálogo y tiene botón de WhatsApp
- **Reservado:** amarillo — se muestra pero puede tener condiciones
- **Vendido:** gris — se muestra con banner "Vendido", sin botón de WhatsApp

### Ocultar un vehículo (sin eliminar)
- Desactivá el toggle **"Activo"** en el listado
- El vehículo desaparece del catálogo público pero sigue en la base de datos
- Podés activarlo nuevamente cuando quieras

### Eliminar un vehículo
1. En el listado, hacé clic en **"Eliminar"**
2. Confirmá en el modal que aparece
3. **Se borrarán también todas las fotos** del vehículo

### Destacar vehículos
- Activá el toggle **"Destacado"** para que el vehículo aparezca en la sección especial de la home
- Máximo 6 vehículos pueden estar destacados

## 📞 Configurar WhatsApp

El número de WhatsApp se configura en las variables de entorno de Vercel:

1. Entrá a [Vercel Dashboard](https://vercel.com/dashboard)
2. Seleccioná el proyecto
3. Ir a **Settings** → **Environment Variables**
4. Buscá o creá la variable `NEXT_PUBLIC_WA_TELEFONO`
5. El formato debe ser: `5493415551234` (código de país + número sin + ni guiones)

## 🛠️ Configuración técnica

### Variables de entorno requeridas
```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-publica
NEXT_PUBLIC_WA_TELEFONO=5493415551234
NEXT_PUBLIC_SITE_URL=https://tu-dominio.com
```

### Comandos
```bash
npm run dev      # Desarrollo local
npm run build    # Producción
npm run start    # Servir build
```

## 📋 Estado del proyecto

- ✅ Catálogo público con filtros
- ✅ Botón de WhatsApp con mensaje prearmado
- ✅ Panel de administración completo
- ✅ SEO optimizado (sitemap, metadata)
- ✅ Mobile-first

---

¿Necesitás ayuda? Contactá al desarrollador.

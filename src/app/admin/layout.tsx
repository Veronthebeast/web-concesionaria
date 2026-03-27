import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { signOut } from '@/app/auth/actions'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blanco border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="font-bold text-negro text-lg">
                ADMIN
              </Link>
              <Link href="/admin/vehiculos" className="text-gray-600 hover:text-red-600 font-medium">
                Vehículos
              </Link>
              <Link href="/admin/banners" className="text-gray-600 hover:text-red-600 font-medium">
                Banners
              </Link>
              <Link href="/" className="text-gray-600 hover:text-red-600 font-medium" target="_blank">
                Ver sitio
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <form action={signOut} method="post">
                <button
                  type="submit"
                  className="text-sm text-gray-500 hover:text-red-600 font-medium"
                >
                  Cerrar sesión
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}

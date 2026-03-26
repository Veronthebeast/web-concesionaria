import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/ui/Header";

export const metadata: Metadata = {
  title: "Concesionaria | Autos y Motos",
  description: "Encontrá tu próximo vehículo en nuestra concessionaria. Autos y motos disponibles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-blanco">
        <Header />
        {children}
        <footer className="bg-negro text-blanco py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm">© 2024 Concesionaria. Todos los derechos reservados.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

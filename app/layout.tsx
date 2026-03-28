import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Marki — Contenido para tu negocio',
  description: 'Generá estrategia de contenido profesional para redes sociales con IA',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}

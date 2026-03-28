import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Marki — Contenido para tu negocio',
  description: 'Generá estrategia de contenido profesional para redes sociales con IA',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}

import { Metadata } from 'next'
import { AppProvider } from '../context/AppContext'
import './globals.css'
import "maplibre-gl/dist/maplibre-gl.css";
 
export const metadata: Metadata = {
  title: 'Kidoa - Explora en Familia',
  description: 'La App premium para familias con KIDOA IA',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Kidoa',
  },
}

export const viewport = {
  themeColor: '#002C77',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/assets/logo.png" />
      </head>
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  )
}

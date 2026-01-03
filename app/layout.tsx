import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Life Gambling with Scientific Research',
  description: 'A Monopoly-style board game about investing life in establishing scientific theories',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Architects+Daughter&family=Caveat:wght@400;600;700&family=Indie+Flower&family=Patrick+Hand&family=Permanent+Marker&family=Press+Start+2P&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}

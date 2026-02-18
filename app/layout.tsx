import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Neo World Weby',
  description: 'Neo World Weby website template',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

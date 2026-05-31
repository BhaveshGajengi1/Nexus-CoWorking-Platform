import type { Metadata, Viewport } from 'next'
import { DM_Sans, Syne, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  title: 'NEXUS | Coworking Command Center',
  description: 'Multi-center operations command center for coworking space operators',
}

export const viewport: Viewport = {
  themeColor: '#0A0A0F',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-[#0A0A0F]">
      <body className={`${dmSans.variable} ${syne.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#0A0A0F] text-[#E8E8ED]`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

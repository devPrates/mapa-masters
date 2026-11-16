import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Quicksand } from 'next/font/google'
import './globals.css'

import { PRELOADER_INLINE_SCRIPT } from '@/lib/preloader'

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-quicksand',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CCD Masters — Encontre um Master de Contabilidade Digital no seu estado',
  description:
    'Mapa nacional dos Masters CCD, a rede de contadores parceiros formada pelo método CCD, criado por Anderson Maisse. Encontre um Master no seu estado.',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // suppressHydrationWarning: o script abaixo adiciona data-js/data-preloaded
    // no <html> antes do React hidratar.
    <html lang="pt-BR" className={quicksand.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PRELOADER_INLINE_SCRIPT }} />
      </head>
      <body className="antialiased font-sans bg-white text-ccd-ink">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

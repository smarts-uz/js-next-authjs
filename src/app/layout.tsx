import { Suspense } from 'react'
import { Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'

import { Toaster } from '@/components/ui/sonner'

import type { Metadata } from 'next'
import './globals.css'

const font = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: {
    default: 'Auth: Next.js authentication app',
    template: '%s · Auth'
  },
  description:
    'Next.js Auth Flow is an practical example how to use authentication using both credentials and OAuth providers like Google, Yandex and GitHub',
  twitter: {
    card: 'summary_large_image'
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
        <Toaster position="top-right" richColors closeButton style={{ cursor: 'pointer' }} />
        <Suspense>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}

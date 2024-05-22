import { Poppins } from 'next/font/google'

import type { Metadata } from 'next'

import './globals.css'

const font = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
})

export const metadata: Metadata = {
  title: '',
  description: ''
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={font.className}>{children}</body>
    </html>
  )
}

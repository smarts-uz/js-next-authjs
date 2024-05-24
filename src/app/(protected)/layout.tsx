import { SessionProvider } from 'next-auth/react'

import { auth } from '@/auth'
import Navbar from '@/app/(protected)/_components/navbar'

interface ProtectedLayoutProps {
  children?: React.ReactNode
}

export default async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <div className="min-h-full px-3 py-4 w-full flex flex-col gap-y-3 sm:gap-y-10 items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
        <Navbar />
        {children}
      </div>
    </SessionProvider>
  )
}

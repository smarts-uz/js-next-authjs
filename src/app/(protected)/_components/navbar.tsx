'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { UserButton } from '@/components/auth/button/user-button'

const tabs = ['server', 'client', 'settings', 'admin']

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-secondary flex items-center justify-between p-4 rounded-xl shadow-sm w-[600px]">
      <div className="flex gap-x-2">
        {tabs.map(tab => (
          <Button asChild variant={pathname === `/${tab}` ? 'default' : 'outline'} key="tab">
            <Link href={tab} className="capitalize">
              {tab}
            </Link>
          </Button>
        ))}
      </div>
      <UserButton />
    </nav>
  )
}

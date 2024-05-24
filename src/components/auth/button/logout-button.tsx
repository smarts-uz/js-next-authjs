'use client'

import { logout } from '@/actions/logout'

interface LogoutButtonProps {
  children?: React.ReactNode
  asChild?: boolean
}

export const LogoutButton = ({ children, asChild }: LogoutButtonProps) => {
  const handleLogout = () => logout()

  return (
    <span onClick={handleLogout} className="cursor-pointer outline-none">
      {children}
    </span>
  )
}

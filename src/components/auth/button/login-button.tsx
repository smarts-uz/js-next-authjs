'use client'

import { useRouter } from 'next/navigation'

interface LoginButtonProps {
  children: React.ReactNode
  method?: 'modal' | 'redirect'
  asChild?: boolean
}

export const LoginButton = ({ children, method = 'redirect', asChild }: LoginButtonProps) => {
  const router = useRouter()

  const handleLogin = () => {
    router.push('/auth/login')
  }

  return (
    <span onClick={handleLogin} className="cursor-pointer">
      {children}
    </span>
  )
}

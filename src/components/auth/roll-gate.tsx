'use client'

import { UserRole } from '@prisma/client'

import { useCurrentUser } from '@/hooks/useCurrentUser'
import { FormError } from '@/components/auth/form/form-error'

interface RollGateProps {
  children: React.ReactNode
  allowedRole?: UserRole
}

export const RollGate = ({ children, allowedRole }: RollGateProps) => {
  const user = useCurrentUser()

  if (user?.role !== allowedRole) {
    return <FormError message="You do not have permission!" />
  }

  return <div>{children}</div>
}

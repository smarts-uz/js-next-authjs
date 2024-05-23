'use server'

import { UserRole } from '@prisma/client'

import { getCurrentUser } from '@/helpers/current-user'

export const admin = async () => {
  const user = await getCurrentUser()

  if (user?.role === UserRole.ADMIN) return { success: 'Allowed Server Action!' }
  else return { error: 'Forbidden Server Action!' }
}

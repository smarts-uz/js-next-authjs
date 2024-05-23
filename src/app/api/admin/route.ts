import { NextResponse } from 'next/server'
import { UserRole } from '@prisma/client'

import { getCurrentUser } from '@/helpers/current-user'

export async function GET() {
  const user = await getCurrentUser()

  if (user?.role === UserRole.ADMIN) return new NextResponse(null, { status: 200 })
  else return new NextResponse(null, { status: 403 })
}

import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}

// global this is not affected by hot reload
export const db = globalThis || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db

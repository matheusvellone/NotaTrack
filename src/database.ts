import { PrismaClient } from '@prisma/client'
import { debugEnabled, isProduction } from '~/helpers/env'

const prismaClientSingleton = () => {
  const prismaInstance = new PrismaClient({
    log: debugEnabled ? ['query'] : undefined,
  })

  return prismaInstance
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClientSingleton
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (!isProduction) {
  globalForPrisma.prisma = prisma
}

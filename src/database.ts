import { PrismaClient } from '@prisma/client'
import { isLocal, isTest } from '~/helpers/env'

const logQueries = isLocal && !isTest

const prismaClientSingleton = () => {
  const prismaInstance = new PrismaClient({
    log: logQueries ? ['query'] : undefined,
  })

  return prismaInstance
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClientSingleton
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

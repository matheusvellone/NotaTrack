import { prisma } from '~/database'
import { publicProcedure } from '../trpc'

export const list = publicProcedure
  .query(() => {
    return prisma.store.findMany()
  })

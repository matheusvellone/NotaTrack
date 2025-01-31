import { prisma } from '~/database'
import { publicProcedure } from '../trpc'
import { buildModelIdSchema } from '~/helpers/zod'
import { Store } from '~/entities'

const idRule = buildModelIdSchema<Store>()

export const list = publicProcedure
  .query(() => {
    return prisma.store.findMany()
  })

export const show = publicProcedure
  .input(idRule)
  .query(({ input }) => {
    return prisma.store.findFirstOrThrow({
      where: {
        id: input,
      },
    })
  })

import { z } from 'zod'
import { publicProcedure } from '../trpc'
import { InvoiceAccessKey } from '~/helpers/types'
import {
  create as createInvoice,
} from '~/services/invoice'
import { prisma } from '~/database'

const nfceAccessKeySchema = z.custom<InvoiceAccessKey>((value) => {
  if (typeof value !== 'string') {
    return false
  }

  return value.match(/\d{44}/)
}, 'Invalid access key')

const createSchema = z.object({
  nfceAccessKey: nfceAccessKeySchema,
})

export const create = publicProcedure
  .input(createSchema)
  .mutation(({ input }) => {
    return createInvoice(input.nfceAccessKey)
  })

export const list = publicProcedure
  .query(() => {
    return prisma.invoice.findMany()
  })

import { z } from 'zod'
import { publicProcedure } from '../trpc'
import { InvoiceAccessKey } from '~/helpers/types'
import {
  process as processInvoice,
  show as showInvoice,
} from '~/services/invoice'
import { prisma } from '~/database'

const nfceAccessKeySchema = z.custom<InvoiceAccessKey>((value) => {
  if (typeof value !== 'string') {
    return false
  }

  return value.match(/\d{44}/)
}, 'Invalid access key')

const processSchema = z.object({
  nfceAccessKey: nfceAccessKeySchema,
})

export const process = publicProcedure
  .input(processSchema)
  .mutation(({ input }) => {
    return processInvoice(input.nfceAccessKey)
  })

export const list = publicProcedure
  .query(() => {
    return prisma.invoice.findMany()
  })

const showSchema = z.object({
  id: z.number(),
})

export const show = publicProcedure
  .input(showSchema)
  .query(({ input }) => {
    return showInvoice(input.id)
  })

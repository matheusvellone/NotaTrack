import { z } from 'zod'
import { publicProcedure } from '../trpc'
import { InvoiceAccessKey } from '~/helpers/types'
import {
  importInvoices,
  process as processInvoice,
  show as showInvoice,
} from '~/services/invoice'
import { ufSchema } from '~/helpers/uf'
import invoiceSchema from '~/schemas/invoice'
import db from '~/database/index'
import { InvoiceStatus } from '~/database/schema'
import { getEnumValues } from '~/helpers/enum'

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

const listSchema = z.object({
  status: z.enum(getEnumValues(InvoiceStatus)).nullable().optional(),
})
export const list = publicProcedure
  .input(listSchema)
  .query(async ({ input }) => {
    return db.query.invoiceTable.findMany({
      where: (fields, { eq }) => {
        if (!input.status) {
          return
        }

        return eq(fields.status, input.status)
      },
      with: {
        store: true,
      },
    })
  })

const showSchema = z.object({
  id: invoiceSchema.id,
})

export const show = publicProcedure
  .input(showSchema)
  .query(({ input }) => {
    return showInvoice(input.id)
  })

const loadAllSchema = z.object({
  uf: ufSchema,
  username: z.string(),
  password: z.string(),
})

export const loadAll = publicProcedure
  .input(loadAllSchema)
  .mutation(({ input }) => {
    const {
      uf,
      ...loginInput
    } = input
    return importInvoices(loginInput, uf)
  })

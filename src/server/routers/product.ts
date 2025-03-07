import { prisma } from '~/database'
import { publicProcedure } from '../trpc'
import { Invoice, InvoiceProduct, Product } from '~/entities'
import { buildModelIdSchema } from '~/helpers/zod'

const idRule = buildModelIdSchema<Product>()

export const list = publicProcedure
  .query(() => {
    return prisma.product.findMany()
  })

export const show = publicProcedure
  .input(idRule)
  .query(async ({ input }) => {
    return await prisma.product.findFirstOrThrow({
      where: {
        id: input,
      },
      include: {
        invoiceProducts: {
          include: {
            invoice: true,
          },
        },
      },
    }) as Product & {
      invoiceProducts: Array<InvoiceProduct & {
        invoice: Invoice
      }>
    }
  })

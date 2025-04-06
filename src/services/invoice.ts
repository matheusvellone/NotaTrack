import Promise from 'bluebird'
import { DateTime } from 'luxon'
import { InvoiceAccessKey } from '~/helpers/types'
import { importInvoicesFromUF, processInvoice } from '~/invoiceProvider'
import { UF } from '~/helpers/uf'
import db from '../database'
import { invoiceTable, InvoiceStatus, storeTable, Invoice, productTable, storeProductTable, invoiceProductTable } from '~/database/schema'
import { and, eq, sql } from 'drizzle-orm'
import ModelNotFoundError from '~/Errors/trpc/ModelNotFoundError'
import UniqueConstraintError from '~/Errors/trpc/UniqueConstraintError'

export const process = async (invoiceAccessKey: InvoiceAccessKey) => {
  const [invoice] = await db.insert(invoiceTable)
    .values({
      accessKey: invoiceAccessKey,
      status: InvoiceStatus.PENDING,
    })
    .returning()
    .onConflictDoUpdate({
      target: invoiceTable.accessKey,
      set: {
        status: InvoiceStatus.PENDING,
      },
      setWhere: sql`${invoiceTable.status} != ${InvoiceStatus.PROCESSED}`,
    })

  if (!invoice) {
    throw new UniqueConstraintError('Invoice.accessKey')
  }

  try {
    const content = await processInvoice(invoiceAccessKey)

    if (content.accessKey !== invoiceAccessKey) {
      throw new Error('InvoiceAccessKey returned from provider does not match the requested InvoiceAccessKey')
    }

    await db.transaction(async (transaction) => {
      const getStore = async () => {
        const existingStore = await transaction.query.storeTable.findFirst({
          where: eq(storeTable.cnpj, content.storeCNPJ),
        })

        if (existingStore) {
          return existingStore
        }

        const [store] = await transaction.insert(storeTable)
          .values({
            name: content.storeName,
            cnpj: content.storeCNPJ,
          })
          .onConflictDoNothing({
            target: storeTable.cnpj,
          })
          .returning()

        // TODO: tipagem do drizzle é um array que permite undefined
        if (!store) {
          throw new Error('Store insertion failed')
        }

        return store
      }

      const store = await getStore()

      await Promise.each(content.products, async (invoiceProduct) => {
        let storeProduct = await transaction.query.storeProductTable.findFirst({
          where: and(
            eq(storeProductTable.storeId, store.id),
            eq(storeProductTable.code, invoiceProduct.storeCode)
          ),
        })

        if (!storeProduct) {
          const getOrCreateProduct = async () => {
            if (invoiceProduct.ean) {
              const productByEan = await transaction.query.productTable.findFirst({
                where: eq(productTable.ean, invoiceProduct.ean),
              })

              if (productByEan) {
                return productByEan
              }
            }

            const productByName = await transaction.query.productTable.findFirst({
              where: and(
                eq(productTable.name, invoiceProduct.name),
                eq(productTable.unit, invoiceProduct.unit)
              ),
            })

            if (productByName) {
              return productByName
            }

            const [product] = await transaction
              .insert(productTable)
              .values({
                name: invoiceProduct.name,
                unit: invoiceProduct.unit,
                ean: invoiceProduct.ean,
              })
              .returning()

            // TODO: tipagem do drizzle é um array que permite undefined
            if (!product) {
              throw new Error('Product insertion failed')
            }

            return product
          }
          const product = await getOrCreateProduct()

          const [createdStoreProduct] = await transaction
            .insert(storeProductTable)
            .values({
              code: invoiceProduct.storeCode,
              storeId: store.id,
              productId: product.id,
            })
            .returning()

          // TODO: tipagem do drizzle é um array que permite undefined
          if (!createdStoreProduct) {
            throw new Error('Store product insertion failed')
          }

          storeProduct = createdStoreProduct
        }

        await transaction.insert(invoiceProductTable).values({
          invoiceId: invoice.id,
          productId: storeProduct.productId,
          price: invoiceProduct.price,
          unitPrice: invoiceProduct.unitPrice,
          quantity: invoiceProduct.quantity.toString(),
          tax: invoiceProduct.tax,
          discount: invoiceProduct.discount,
        })
      })

      const totalValue = content.products.reduce((acc, product) => acc + product.price - (product.discount ?? 0), 0)
      await transaction
        .update(invoiceTable)
        .set({
          status: InvoiceStatus.PROCESSED,
          emissionDate: content.emissionDate,
          processedAt: DateTime.now().toJSDate(),
          storeId: store.id,
          totalValue,
        })
        .where(eq(invoiceTable.id, invoice.id))
    })
  } catch (error) {
    await db
      .update(invoiceTable)
      .set({
        status: InvoiceStatus.ERROR,
      })
      .where(eq(invoiceTable.id, invoice.id))

    throw error
  }
}

export const show = async (id: Invoice['id']) => {
  const invoice = await db.query.invoiceTable.findFirst({
    where: (fields, { eq }) => {
      return eq(fields.id, id)
    },
    with: {
      invoiceProducts: {
        with: {
          product: true,
        },
      },
    },
  })

  if (!invoice) {
    throw new ModelNotFoundError('Invoice')
  }

  return invoice
}

type UserInput = {
  username: string
  password: string
}
export const importInvoices = async (input: UserInput, uf: UF) => {
  const invoices = await importInvoicesFromUF(input, uf)

  const alreadyImported = await db.query.invoiceTable.findMany({
    where: (fields, { inArray }) => {
      return inArray(fields.accessKey, invoices)
    },
  })

  const alreadyImportedAccessKeys = new Set(alreadyImported.map((invoice) => invoice.accessKey))

  const values = invoices
    .filter((accessKey) => !alreadyImportedAccessKeys.has(accessKey))
    .map((accessKey) => ({
      accessKey,
      status: InvoiceStatus.PENDING,
    }))

  await db.insert(invoiceTable).values(values)
}

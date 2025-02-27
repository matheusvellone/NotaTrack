import { InvoiceStatus } from '@prisma/client'
import Promise from 'bluebird'
import { DateTime } from 'luxon'
import { prisma } from '~/database'
import { Invoice } from '~/entities'
import { InvoiceAccessKey } from '~/helpers/types'
import providers from '~/providers'

export const process = async (invoiceAccessKey: InvoiceAccessKey) => {
  const invoice = await prisma.invoice.upsert({
    where: {
      accessKey: invoiceAccessKey,
      status: InvoiceStatus.PENDING,
    },
    create: {
      accessKey: invoiceAccessKey,
      status: InvoiceStatus.PENDING,
    },
    update: {},
  })

  try {
    const content = await providers.raw.query(invoiceAccessKey)

    if (content.accessKey !== invoiceAccessKey) {
      throw new Error('InvoiceAccessKey returned from provider does not match the requested InvoiceAccessKey')
    }

    await prisma.$transaction(async ($prisma) => {
      const store = await $prisma.store.upsert({
        where: {
          cnpj: content.storeCNPJ,
        },
        create: {
          name: content.storeName,
          cnpj: content.storeCNPJ,
        },
        update: {},
      })

      await Promise.each(content.products, async (invoiceProduct) => {
        let storeProduct = await $prisma.storeProduct.findFirst({
          where: {
            storeId: store.id,
            code: invoiceProduct.storeCode,
          },
        })

        if (!storeProduct) {
          const getOrCreateProduct = async () => {
            if (invoiceProduct.ean) {
              const productByEan = await $prisma.product.findUnique({
                where: {
                  ean: invoiceProduct.ean,
                },
              })

              if (productByEan) {
                return productByEan
              }
            }

            const productByName = await $prisma.product.findFirst({
              where: {
                name: invoiceProduct.name,
                unit: invoiceProduct.unit,
              },
            })

            if (productByName) {
              return productByName
            }

            return $prisma.product.create({
              data: {
                name: invoiceProduct.name,
                unit: invoiceProduct.unit,
                ean: invoiceProduct.ean,
              },
            })
          }
          const product = await getOrCreateProduct()

          storeProduct = await $prisma.storeProduct.create({
            data: {
              code: invoiceProduct.storeCode,
              storeId: store.id,
              productId: product.id,
            },
          })
        }

        await $prisma.invoiceProduct.create({
          data: {
            invoiceId: invoice.id,
            productId: storeProduct.productId,
            price: invoiceProduct.price,
            quantity: invoiceProduct.quantity,
            tax: invoiceProduct.tax,
            discount: invoiceProduct.discount,
          },
        })
      })

      await $prisma.invoice.update({
        where: {
          id: invoice.id,
        },
        data: {
          status: InvoiceStatus.PROCESSED,
          processedAt: DateTime.now().toJSDate(),
        },
      })
    })
  } catch (error) {
    await prisma.invoice.update({
      where: {
        id: invoice.id,
      },
      data: {
        status: InvoiceStatus.ERROR,
      },
    })
    throw error
  }
}

export const show = async (id: Invoice['id']) => {
  return prisma.invoice.findUniqueOrThrow({
    where: {
      id,
    },
  })
}

import Promise from 'bluebird'
import { prisma } from '~/database'
import { InvoiceAccessKey } from '~/helpers/types'
import providers from '~/providers'

export const create = async (invoiceAccessKey : InvoiceAccessKey) => {
  const content = await providers.development.query(invoiceAccessKey)

  await prisma.$transaction(async ($prisma) => {
    const store = await $prisma.store.upsert({
      where: {
        cnpj: content.storeCNPJ,
      },
      create: {
        name: content.storeName,
        cnpj: content.storeCNPJ,
      },
      update: {
        name: content.storeName,
      },
    })

    const invoice = await $prisma.invoice.create({
      data: {
        accessKey: content.accessKey,
        emittedAt: content.emittedAt,
        processedAt: new Date(),
      },
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
          price: invoiceProduct.value,
          quantity: invoiceProduct.quantity,
          taxes: invoiceProduct.taxValue,
        },
      })
    })
  })
}

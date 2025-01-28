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
      }
    })

    await Promise.each(content.products, async (product) => {
      let storeProduct = await $prisma.storeProduct.findFirst({
        where: {
          storeId: store.id,
          code: product.code,
        },
      })

      if (!storeProduct) {
        const createdProduct = await $prisma.product.create({
          data: {
            name: product.name,
            unit: product.unit,
          },
        })

        storeProduct = await $prisma.storeProduct.create({
          data: {
            code: product.code,
            storeId: store.id,
            productId: createdProduct.id,
          },
        })
      }

      await $prisma.invoiceProduct.create({
        data: {
          invoiceId: invoice.id,
          productId: storeProduct.productId,
          price: product.value,
          quantity: product.quantity,
        },
      })
    })
  })
}

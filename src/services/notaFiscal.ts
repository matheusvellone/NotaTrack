import Promise from 'bluebird'
import { prisma } from '~/database'
import { ChaveAcessoNFCe } from '~/helpers/types'
import providers from '~/providers'

export const query = async (chaveAcesso : ChaveAcessoNFCe) => {
  const content = await providers.development.query(chaveAcesso)

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

    const notaFiscal = await $prisma.notaFiscal.create({
      data: {
        chaveAcesso,
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

      await $prisma.notaFiscalProducts.create({
        data: {
          notaFiscalId: notaFiscal.id,
          productId: storeProduct.productId,
          price: product.value,
          quantity: product.quantity,
        },
      })
    })

  })

  console.log(content)
}

'use client'

import { Group, Stack, Text } from '@mantine/core'
import { use } from 'react'
import { trpc } from '~/helpers/trpc'
import productSchema from '~/schemas/product'

type Props = {
  params: Promise<{
    id: string
  }>
}

const ProductDetail = ({ params }: Props) => {
  const { id } = use(params)

  const {
    error: validationError,
    data: parsedId,
  } = productSchema.id.safeParse(Number(id))

  if (validationError) {
    return validationError.toString()
  }

  const showProduct = trpc.product.show.useQuery(parsedId)

  if (showProduct.isFetching) {
    return <div>Loading...</div>
  }

  if (!showProduct.isSuccess) {
    return <div>Error: {showProduct.error?.message}</div>
  }

  const product = showProduct.data

  return (
    <Stack>
      <Group>
        <Text>Name</Text>
        <Text>{product.name}</Text>
      </Group>
      <Group>
        <Text>Unit</Text>
        <Text>{product.unit}</Text>
      </Group>
    </Stack>
  )
}

export default ProductDetail

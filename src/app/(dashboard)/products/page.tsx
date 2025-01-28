'use client'

import { Anchor, Group, Stack } from '@mantine/core'
import Link from 'next/link'
import { trpc } from '~/helpers/trpc'

const ProductList = () => {
  const listProducts = trpc.product.list.useQuery()

  if (listProducts.isFetching) {
    return <div>Loading...</div>
  }

  if (!listProducts.isSuccess) {
    return <div>Error: {listProducts.error?.message}</div>
  }

  const products = listProducts.data

  return (
    <Stack>
      {products.map((product) => (
        <Group key={product.id}>
          <Anchor
            component={Link}
            href={`/products/${product.id}`}
          >
            {product.name}
          </Anchor>
        </Group>
      ))}
    </Stack>
  )
}

export default ProductList

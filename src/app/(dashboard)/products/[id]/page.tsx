'use client'

import { Anchor, Group, Stack, Table, Text } from '@mantine/core'
import Link from 'next/link'
import { use } from 'react'
import Amount from '~/components/Amount'
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
        <Text>Unidade</Text>
        <Text>{product.unit}</Text>
      </Group>
      <Table striped>
        <Table.Thead>
          <Table.Th>Nota Fiscal</Table.Th>
          <Table.Th>Data da compra</Table.Th>
          <Table.Th>Valor pago</Table.Th>
          <Table.Th>Quantidade</Table.Th>
        </Table.Thead>
        <Table.Tbody>
          {
            product.invoiceProducts.map((invoiceProduct) => (
              <Table.Tr key={invoiceProduct.id}>
                <Table.Td>
                  <Anchor
                    component={Link}
                    href={`/invoices/${invoiceProduct.invoice.id}`}
                  >
                    {invoiceProduct.invoice.id}
                  </Anchor>
                </Table.Td>
                <Table.Td>{invoiceProduct.invoice.emissionDate}</Table.Td>
                <Table.Td><Amount>{invoiceProduct.price}</Amount></Table.Td>
                <Table.Td>{invoiceProduct.quantity}</Table.Td>
              </Table.Tr>
            ))
          }
        </Table.Tbody>
      </Table>
    </Stack>
  )
}

export default ProductDetail

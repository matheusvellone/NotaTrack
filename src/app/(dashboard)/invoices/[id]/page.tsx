'use client'

import { Button, Group, SimpleGrid, Stack, Text } from '@mantine/core'
import { InvoiceStatus } from '@prisma/client'
import { use } from 'react'
import Amount from '~/components/Amount'
import Date from '~/components/Date'
import InvoiceStatusBadge from '~/components/InvoiceStatusBadge'
import { trpc } from '~/helpers/trpc'
import invoiceSchema from '~/schemas/invoice'

type Props = {
  params: Promise<{
    id: string
  }>
}

const InvoiceDetail = ({ params }: Props) => {
  const { id } = use(params)

  const {
    error: validationError,
    data: parsedId,
  } = invoiceSchema.id.safeParse(Number(id))

  if (validationError) {
    return validationError.toString()
  }

  const showInvoice = trpc.invoice.show.useQuery({ id: parsedId })
  const processInvoice = trpc.invoice.process.useMutation({
    trpc: {
      context: {
        notificate: {
          success: 'Nota fiscal reprocessada com sucesso',
          error: 'Erro ao reprocessar nota fiscal',
        },
      },
    },
  })

  if (showInvoice.isFetching) {
    return <div>Loading...</div>
  }

  if (!showInvoice.isSuccess) {
    return <div>Error: {showInvoice.error?.message}</div>
  }

  const invoice = showInvoice.data

  const reprocessInvoice = async () => {
    await processInvoice.mutateAsync({
      nfceAccessKey: invoice.accessKey,
    })

    void showInvoice.refetch()
  }

  return (
    <Stack>
      {
        invoice.status === InvoiceStatus.PROCESSED ? null : (
          <Button onClick={reprocessInvoice}>
            Reprocessar
          </Button>
        )
      }
      <Group>
        <Text>Chave de Acesso</Text>
        <Text>{invoice.accessKey}</Text>
      </Group>
      <Group>
        <Text>Status</Text>
        <InvoiceStatusBadge status={invoice.status} />
      </Group>
      <Group>
        <Text>Valor da compra</Text>
        {
          invoice.totalValue === null ? '-' : (
            <Amount>{invoice.totalValue}</Amount>
          )
        }
      </Group>
      <Group>
        <Text>Data da Compra</Text>
        {
          invoice.emissionDate ? (
            <Date
              date={invoice.emissionDate}
              dateStyle='short'
              timeStyle='medium'
            />
          ) : '-'
        }
      </Group>

      <SimpleGrid cols={{ xs: 1, sm: 3, md: 6 }}>
        {
          invoice.invoiceProducts.map((invoiceProduct) => (
            <Stack key={invoiceProduct.id} style={{ border: '1px solid white' }}>
              <Text>{invoiceProduct.product.name}</Text>
              <Text>{invoiceProduct.quantity}x <Amount span>{invoiceProduct.unitPrice}</Amount>/{invoiceProduct.product.unit} = <Amount span>{invoiceProduct.price}</Amount></Text>
              <Text>
                Desconto: <Amount span>{invoiceProduct.discount ?? 0}</Amount>
              </Text>
              <Text>
                Imposto: <Amount span>{invoiceProduct.tax ?? 0}</Amount>
              </Text>
            </Stack>
          ))
        }
      </SimpleGrid>
    </Stack>
  )
}

export default InvoiceDetail

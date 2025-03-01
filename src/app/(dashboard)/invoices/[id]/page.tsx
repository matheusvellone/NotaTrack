'use client'

import { Button, Group, Stack, Text } from '@mantine/core'
import { InvoiceStatus } from '@prisma/client'
import { use } from 'react'
import Date from '~/components/Date'
import InvoiceStatusBadge from '~/components/InvoiceStatusBadge'
import { trpc } from '~/helpers/trpc'

type Props = {
  params: Promise<{
    id: string
  }>
}

const InvoiceDetail = ({ params }: Props) => {
  const { id } = use(params)

  const showInvoice = trpc.invoice.show.useQuery({ id: Number(id) })
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
    return <div>Error: {showInvoice.error.message}</div>
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
    </Stack>
  )
}

export default InvoiceDetail

'use client'

import { Group, Stack, Text } from '@mantine/core'
import { use } from 'react'
import { trpc } from '~/helpers/trpc'

type Props = {
  params: Promise<{
    id: string
  }>
}

const InvoiceDetail = ({ params }: Props) => {
  const { id } = use(params)

  const showInvoice = trpc.invoice.show.useQuery(id)

  if (showInvoice.isFetching) {
    return <div>Loading...</div>
  }

  if (!showInvoice.isSuccess) {
    return <div>Error: {showInvoice.error.message}</div>
  }

  const invoice = showInvoice.data

  return (
    <Stack>
      <Group>
        <Text>AccessKey</Text>
        <Text>{invoice.accessKey}</Text>
      </Group>
    </Stack>
  )
}

export default InvoiceDetail

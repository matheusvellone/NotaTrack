'use client'

import { Anchor, Group, Stack } from '@mantine/core'
import Link from 'next/link'
import { trpc } from '~/helpers/trpc'

const InvoicesList = () => {
  const listInvoices = trpc.invoice.list.useQuery()

  if (listInvoices.isFetching) {
    return <div>Loading...</div>
  }

  if (!listInvoices.isSuccess) {
    return <div>Error: {listInvoices.error?.message}</div>
  }

  const invoices = listInvoices.data

  return (
    <Stack>
      {invoices.map((invoice) => (
        <Group key={invoice.id}>
          <Anchor
            component={Link}
            href={`/invoices/${invoice.id}`}
          >
            {invoice.accessKey}
          </Anchor>
        </Group>
      ))}
    </Stack>
  )
}

export default InvoicesList

'use client'

import { Anchor, Button, Group, Select, Stack } from '@mantine/core'
import { useSetState } from '@mantine/hooks'
import Link from 'next/link'
import Date from '~/components/Date'
import InvoiceStatusBadge from '~/components/InvoiceStatusBadge'
import { InvoiceStatus } from '~/database/schema'
import { isValidEnumValue } from '~/helpers/enum'
import { trpc } from '~/helpers/trpc'
import { InvoiceAccessKey } from '~/helpers/types'

type Filter = {
  status?: InvoiceStatus
}

const InvoicesList = () => {
  const [filters, setFilters] = useSetState<Filter>({})

  const listInvoices = trpc.invoice.list.useQuery(filters)
  const processInvoice = trpc.invoice.process.useMutation()

  if (listInvoices.isFetching) {
    return <div>Loading...</div>
  }

  if (!listInvoices.isSuccess) {
    return <div>Error: {listInvoices.error?.message}</div>
  }

  const invoices = listInvoices.data

  const reprocessInvoice = async (invoiceAccessKey: InvoiceAccessKey) => {
    await processInvoice.mutateAsync({
      nfceAccessKey: invoiceAccessKey,
    })

    void listInvoices.refetch()
  }

  return (
    <Stack>
      <Group>
        <Select
          label='Status'
          data={Object.values(InvoiceStatus)}
          allowDeselect
          renderOption={({ option }) => {
            if (!option.value) {
              return 'Todos'
            }

            if (!isValidEnumValue(option.value, InvoiceStatus)) {
              return null
            }

            return (
              <InvoiceStatusBadge status={option.value}/>
            )
          }}
          onChange={(status) => setFilters({
            status: (status as InvoiceStatus | null) || undefined,
          })}
        />
      </Group>
      {
        invoices.map((invoice) => (
          <Group key={invoice.id}>
            {
              invoice.emissionDate ? (
                <Date date={invoice.emissionDate}/>
              ) : null
            }
            {
              invoice.store ? (
                <Anchor
                  component={Link}
                  href={`/stores/${invoice.store.id}`}
                >
                  {invoice.store.name}
                </Anchor>
              ) : null
            }
            <Anchor
              component={Link}
              href={`/invoices/${invoice.id}`}
            >
              {invoice.accessKey}
            </Anchor>
            <InvoiceStatusBadge status={invoice.status} />
            {
              invoice.status === InvoiceStatus.PROCESSED ? null : (
                <Button onClick={() => void reprocessInvoice(invoice.accessKey)}>
                  Reprocessar
                </Button>
              )
            }
          </Group>
        ))
      }
    </Stack>
  )
}

export default InvoicesList

'use client'

import { Group, Stack, Text } from '@mantine/core'
import { use } from 'react'
import Document from '~/components/Document'
import { trpc } from '~/helpers/trpc'

type Props = {
  params: Promise<{
    id: string
  }>
}

const StoreDetail = ({ params }: Props) => {
  const { id } = use(params)

  const showStore = trpc.store.show.useQuery(Number(id))

  if (showStore.isFetching) {
    return <div>Loading...</div>
  }

  if (!showStore.isSuccess) {
    return <div>Error: {showStore.error.message}</div>
  }

  const store = showStore.data

  return (
    <Stack>
      <Group>
        <Text>Nome</Text>
        <Text>{store.name}</Text>
      </Group>
      <Group>
        <Text>Documento</Text>
        <Document document={store.cnpj} />
      </Group>

    </Stack>
  )
}

export default StoreDetail

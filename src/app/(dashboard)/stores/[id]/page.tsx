'use client'

import { Group, Stack, Text } from '@mantine/core'
import { use } from 'react'
import Document from '~/components/Document'
import { trpc } from '~/helpers/trpc'
import storeSchema from '~/schemas/store'

type Props = {
  params: Promise<{
    id: string
  }>
}

const StoreDetail = ({ params }: Props) => {
  const { id } = use(params)

  const {
    error: validationError,
    data: parsedId,
  } = storeSchema.id.safeParse(id)

  if (validationError) {
    return validationError.toString()
  }

  const showStore = trpc.store.show.useQuery(parsedId)

  if (showStore.isFetching) {
    return <div>Loading...</div>
  }

  if (!showStore.isSuccess) {
    return <div>Error: {showStore.error?.message}</div>
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

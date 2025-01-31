'use client'

import { Group, Stack, Text } from '@mantine/core'
import { use } from 'react'
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
        <Text>Name</Text>
        <Text>{store.name}</Text>
      </Group>
    </Stack>
  )
}

export default StoreDetail

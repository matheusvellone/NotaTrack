'use client'

import { Anchor, Group, Stack } from '@mantine/core'
import Link from 'next/link'
import { trpc } from '~/helpers/trpc'

const StoreList = () => {
  const listStores = trpc.store.list.useQuery()

  if (listStores.isFetching) {
    return <div>Loading...</div>
  }

  if (!listStores.isSuccess) {
    return <div>Error: {listStores.error?.message}</div>
  }

  const stores = listStores.data

  return (
    <Stack>
      {stores.map((store) => (
        <Group key={store.id}>
          <Anchor
            component={Link}
            href={`/stores/${store.id}`}
          >
            {store.name}
          </Anchor>
        </Group>
      ))}
    </Stack>
  )
}

export default StoreList

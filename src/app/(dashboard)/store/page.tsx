'use client'

import { trpc } from '~/helpers/trpc'

export default function StoreList() {
  const listStores = trpc.store.list.useQuery()

  if (listStores.isFetching) {
    return <div>Loading...</div>
  }

  if (!listStores.isSuccess) {
    return <div>Error: {listStores.error?.message}</div>
  }

  const stores = listStores.data

  return stores.map((store) => {
    return <div key={store.id}>{store.name}</div>
  })
}

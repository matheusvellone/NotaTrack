import { publicProcedure, router } from '~/server/trpc'

import * as invoiceRoutes from './invoice'
import * as storeRoutes from './store'
import * as productRoutes from './product'

const appRouter = router({
  status: publicProcedure.query(() => {
    return {
      status: 'ok',
      // version,
      // hashVersion: SHORT_HASH_VERSION,
    }
  }),

  product: router(productRoutes),
  store: router(storeRoutes),
  invoice: router(invoiceRoutes),
})

export default appRouter

export type AppRouter = typeof appRouter

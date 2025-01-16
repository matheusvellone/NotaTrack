import { publicProcedure, router } from '~/server/trpc'

import * as nfceRoutes from './nfce'
import * as storeRoutes from './store'

const appRouter = router({
  status: publicProcedure.query(() => {
    return {
      status: 'ok',
      // version,
      // hashVersion: SHORT_HASH_VERSION,
    }
  }),

  store: router(storeRoutes),
  nfce: router(nfceRoutes),
})

export default appRouter

export type AppRouter = typeof appRouter

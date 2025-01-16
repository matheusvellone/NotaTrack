import { TRPCClientError, httpLink } from '@trpc/client'
import { createTRPCNext, WithTRPCConfig } from '@trpc/next'
import type { AppRouter } from '~/server/routers'

const trpcConfig: WithTRPCConfig<AppRouter> = {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        retry: (count, error) => {
          if (count > 5) {
            return false
          }

          if (!(error instanceof TRPCClientError)) {
            return false
          }

          return false
        },
        refetchOnWindowFocus: false,
      },
    },
  },
  links: [
    httpLink({
      url: '/api/trpc',
    }),
  ],
}

export const trpc = createTRPCNext<AppRouter>({
  config: () => trpcConfig,
  ssr: false,
})

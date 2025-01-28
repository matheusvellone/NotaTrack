import { TRPCClientError, TRPCLink, httpLink } from '@trpc/client'
import { createTRPCNext, WithTRPCConfig } from '@trpc/next'
import { observable } from '@trpc/server/observable'
import { invalid } from '~/Errors/trpc/errorCodes'
import type { AppRouter } from '~/server/routers'
import { UseFormReturnType } from '@mantine/form'
import { trpcNProgressLink } from '~/components/RouterTransition'
import { NotificationType, showNotification } from './notifications'

declare module '@trpc/client' {
  interface OperationContext {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form?: UseFormReturnType<any>
    notificate?: {
      error?: string
      success?: string
    }
  }
}

const notificateLink: TRPCLink<AppRouter> = () => ({ next, op }) => {
  const { notificate } = op.context

  if (!notificate) {
    return next(op)
  }

  return observable((observer) => {
    return next(op).subscribe({
      next(data) {
        const notificateSuccess = () => {
          if (!notificate.success) {
            return
          }

          showNotification(NotificationType.SUCCESS, {
            message: notificate.success,
          })
        }

        notificateSuccess()

        observer.next(data)
      },
      error(err) {
        const notificateError = () => {
          if (!notificate.error) {
            return
          }

          if (!err.data?.errorCode) {
            return
          }

          showNotification(NotificationType.ERROR, {
            title: notificate.error,
            message: err.message,
          })
        }

        notificateError()

        observer.error(err)
      },
      complete() {
        observer.complete()
      },
    })
  })
}

const formErrorsLink: TRPCLink<AppRouter> = () => ({ next, op }) => {
  const context = op.context
  const { form } = context

  if (!form) {
    return next(op)
  }

  return observable((observer) => {
    return next(op).subscribe({
      next(value) {
        observer.next(value)
      },
      error(err) {
        if (err.data?.errorCode === invalid.input && err.data.validationErrors) {
          const validationErrors = err.data.validationErrors
            .reduce<Record<string, string>>((acc, issue) => {
              const key = issue.path.join('.')
              acc[key] = issue.message

              return acc
            }, {})

          form.setErrors(validationErrors)
        }
        observer.error(err)
      },
      complete() {
        observer.complete()
      },
    })
  })
}

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
    notificateLink,
    formErrorsLink,
    trpcNProgressLink,
    httpLink({
      url: '/api/trpc',
    }),
  ],
}

export const trpc = createTRPCNext<AppRouter>({
  config: () => trpcConfig,
  ssr: false,
})

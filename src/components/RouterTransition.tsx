'use client'

import { startNavigationProgress, NavigationProgress, completeNavigationProgress } from '@mantine/nprogress'
import { useEffect } from 'react'
import { useMantineColorScheme } from '@mantine/core'
import { TRPCLink } from '@trpc/client'
import { AppRouter } from '~/server/routers'
import { observable } from '@trpc/server/observable'
import { usePathname, useSearchParams } from 'next/navigation'
import '@mantine/nprogress/styles.css'

let timer: NodeJS.Timeout
let state: 'stop' | 'loading' = 'stop'
let activeRequests = 0
const delay = 100

function load() {
  if (state === 'loading') {
    return
  }

  state = 'loading'

  timer = setTimeout(function () {
    startNavigationProgress()
  }, delay) // only show progress bar if it takes longer than the delay
}

function stop() {
  if (activeRequests > 0) {
    return
  }

  state = 'stop'

  clearTimeout(timer)
  completeNavigationProgress()
}

const onStartRequest = () => {
  if (activeRequests === 0) {
    load()
  }

  activeRequests++
}

const onFinishRequest = () => {
  activeRequests -= 1
  stop()
}

const RouterTransition = () => {
  const { colorScheme } = useMantineColorScheme()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    onStartRequest()
    onFinishRequest()
  }, [pathname, searchParams])

  useEffect(() => {
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      onStartRequest()

      try {
        const response = await originalFetch(...args)
        return response
      } finally {
        onFinishRequest()
      }
    }

    return () => {
      window.fetch = originalFetch
    }
  }, [])

  return (
    <NavigationProgress color={ colorScheme === 'dark' ? 'white' : undefined }/>
  )
}

export default RouterTransition

export const trpcNProgressLink: TRPCLink<AppRouter> = () => ({ next, op }) => observable((observer) => {
  onStartRequest()

  return next(op).subscribe({
    next(value) {
      observer.next(value)
    },
    error(err) {
      onFinishRequest()
      observer.error(err)
    },
    complete() {
      onFinishRequest()
      observer.complete()
    },
  })
})

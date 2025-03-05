'use client'

import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { PropsWithChildren } from 'react'
import { Notifications } from '@mantine/notifications'
import RouterTransition from '~/components/RouterTransition'
import { ModalsProvider } from '@mantine/modals'
import { trpc } from '~/helpers/trpc'

const RootLayout = ({ children }: PropsWithChildren) => {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme='auto' />
      </head>
      <body>
        <MantineProvider
          defaultColorScheme="auto"
        >
          <RouterTransition/>
          <Notifications autoClose={5000} position='top-right'/>
          <ModalsProvider>
            {children}
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  )
}

export default trpc.withTRPC(RootLayout)

import { Viewport } from 'next'
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core'
import '@mantine/core/styles.css'
import { PropsWithChildren } from 'react'
import { Notifications } from '@mantine/notifications'
import RouterTransition from '~/components/RouterTransition'

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
          {children}
        </MantineProvider>
      </body>
    </html>
  )
}

export default RootLayout

export const viewport: Viewport = {
  themeColor: [
    {
      color: '#FFF',
      media: '(prefers-color-scheme: light)',
    },
    {
      color: '#242424',
      media: '(prefers-color-scheme: dark)',
    },
  ],
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  width: 'device-width',
  userScalable: false,
  viewportFit: 'cover',
}

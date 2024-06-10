/** @jsxImportSource react */

import type { Metadata, Viewport } from 'next'

import 'raf/polyfill'
import 'setimmediate'
import 'app/config/tailwind/global.css'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

import { Provider } from 'app/provider'

const APP_NAME = 'Family Care Circle'
const APP_DEFAULT_TITLE = 'Family Care Circle'
const APP_TITLE_TEMPLATE = '%s - Family Care Circle'
const APP_DESCRIPTION = 'The app for caregivers.'

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE
  },
  description: APP_DESCRIPTION,
  // appleWebApp: {
  //   // capable: true,
  //   // statusBarStyle: 'black-translucent',
  //   // title: APP_DEFAULT_TITLE,
  //   // startupImage: [
  //   //   '/splash_screens/10.2__iPad_landscape.png',
  //   //   '/splash_screens/10.2__iPad_portrait.png',
  //   //   '/splash_screens/10.5__iPad_landscape.png',
  //   //   '/splash_screens/11__iPad_landscape.png'
  //   // ]
  // },
  formatDetection: {
    telephone: true
  },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE
    },
    description: APP_DESCRIPTION
  },
  twitter: {
    card: 'summary',
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE
    },
    description: APP_DESCRIPTION
  }
}

export const viewport: Viewport = {
  themeColor: '#287CFA'
}
export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Provider>{children}</Provider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}

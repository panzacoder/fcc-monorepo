/** @jsxImportSource react */

import { SplashBackground } from 'app/ui/splash-background'
import { Suspense } from 'react'

export default function SplashLayout({ children }) {
  return (
    <SplashBackground>
      <Suspense>{children}</Suspense>
    </SplashBackground>
  )
}

'use client'
import { PortalHost } from 'app/@rnr/portal'
import { SafeArea } from './safe-area'
import { ReduxProvider } from './redux'

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ReduxProvider>
        <SafeArea>{children}</SafeArea>
      </ReduxProvider>
      <PortalHost />
    </>
  )
}

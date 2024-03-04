'use client'
import { PortalHost } from 'app/@rnr/portal'
import { SafeArea } from './safe-area'

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SafeArea>{children}</SafeArea>
      <PortalHost />
    </>
  )
}

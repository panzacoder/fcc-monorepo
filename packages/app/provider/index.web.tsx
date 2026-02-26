'use client'
import { HydrationGate } from './hydration-gate'
import { StylesProvider } from './styles-provider'
import { AuthGuard } from './auth-guard'
import { QueryProvider } from './query'

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <StylesProvider>
      <HydrationGate>
        <QueryProvider>
          <AuthGuard>{children}</AuthGuard>
        </QueryProvider>
      </HydrationGate>
    </StylesProvider>
  )
}

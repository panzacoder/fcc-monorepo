'use client'
import { ReduxProvider } from './redux'
import { StylesProvider } from './styles-provider'
import { AuthGuard } from './auth-guard'
import { QueryProvider } from './query'

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <StylesProvider>
      <ReduxProvider>
        <QueryProvider>
          <AuthGuard>{children}</AuthGuard>
        </QueryProvider>
      </ReduxProvider>
    </StylesProvider>
  )
}

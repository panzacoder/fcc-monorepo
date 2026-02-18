'use client'
import { ReduxProvider } from './redux'
import { StylesProvider } from './styles-provider'
import { AuthGuard } from './auth-guard'

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <StylesProvider>
      <ReduxProvider>
        <AuthGuard>
          {children}
        </AuthGuard>
      </ReduxProvider>
    </StylesProvider>
  )
}

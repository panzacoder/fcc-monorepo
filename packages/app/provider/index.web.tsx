'use client'
import { ReduxProvider } from './redux'
import { StylesProvider } from './styles-provider'

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <StylesProvider>
      <ReduxProvider>
        {children}
      </ReduxProvider>
    </StylesProvider>
  )
}

'use client'
import { SafeArea } from './safe-area'
import { HydrationGate } from './hydration-gate'
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'
import { StylesProvider } from './styles-provider'
import { AuthGuard } from './auth-guard'
import { QueryProvider } from './query'

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StylesProvider>
        <HydrationGate>
          <QueryProvider>
            <SafeArea>
              <AutocompleteDropdownContextProvider>
                <AuthGuard>{children}</AuthGuard>
              </AutocompleteDropdownContextProvider>
            </SafeArea>
          </QueryProvider>
        </HydrationGate>
      </StylesProvider>
    </>
  )
}

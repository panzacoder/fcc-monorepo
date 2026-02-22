'use client'
import { SafeArea } from './safe-area'
import { ReduxProvider } from './redux'
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'
import { StylesProvider } from './styles-provider'
import { AuthGuard } from './auth-guard'
import { QueryProvider } from './query'

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StylesProvider>
        <ReduxProvider>
          <QueryProvider>
            <SafeArea>
              <AutocompleteDropdownContextProvider>
                <AuthGuard>{children}</AuthGuard>
              </AutocompleteDropdownContextProvider>
            </SafeArea>
          </QueryProvider>
        </ReduxProvider>
      </StylesProvider>
    </>
  )
}

'use client'
import { SafeArea } from './safe-area'
import { ReduxProvider } from './redux'
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'
import { StylesProvider } from './styles-provider'

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StylesProvider>
        <ReduxProvider>
          <SafeArea>
            <AutocompleteDropdownContextProvider>
              {children}
            </AutocompleteDropdownContextProvider>
          </SafeArea>
        </ReduxProvider>
      </StylesProvider>
    </>
  )
}

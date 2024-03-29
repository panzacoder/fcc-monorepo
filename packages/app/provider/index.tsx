'use client'
import { SafeArea } from './safe-area'
import { ReduxProvider } from './redux'
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown'

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ReduxProvider>
        <SafeArea>
          <AutocompleteDropdownContextProvider>
            {children}
          </AutocompleteDropdownContextProvider>
        </SafeArea>
      </ReduxProvider>
    </>
  )
}

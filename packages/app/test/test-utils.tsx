import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider as ReduxStoreProvider } from 'react-redux'
import { legacy_createStore as createStore } from 'redux'
import rootReducer from 'app/redux/rootReducer'
import { render, type RenderOptions } from '@testing-library/react-native'

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0
      },
      mutations: {
        retry: false
      }
    }
  })
}

function ReduxTestProvider({ children }: { children: React.ReactNode }) {
  const store = createStore(rootReducer, {})
  return <ReduxStoreProvider store={store}>{children}</ReduxStoreProvider>
}

type RenderWithProvidersOptions = Omit<RenderOptions, 'wrapper'> & {
  queryClient?: QueryClient
  wrapper?: React.ComponentType<{ children: React.ReactNode }>
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    queryClient = createTestQueryClient(),
    wrapper: StateWrapper = ReduxTestProvider,
    ...options
  }: RenderWithProvidersOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <StateWrapper>{children}</StateWrapper>
      </QueryClientProvider>
    )
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...options }),
    queryClient
  }
}

export * from '@testing-library/react-native'
export { renderWithProviders as render }

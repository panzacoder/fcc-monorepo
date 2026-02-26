import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
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

type RenderWithProvidersOptions = Omit<RenderOptions, 'wrapper'> & {
  queryClient?: QueryClient
  wrapper?: React.ComponentType<{ children: React.ReactNode }>
}

function DefaultWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    queryClient = createTestQueryClient(),
    wrapper: StateWrapper = DefaultWrapper,
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

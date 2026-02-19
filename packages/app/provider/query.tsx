import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Alert } from 'react-native'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false
    },
    mutations: {
      onError: (error: Error) => {
        Alert.alert('', error.message || 'An unexpected error occurred')
      }
    }
  }
})

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

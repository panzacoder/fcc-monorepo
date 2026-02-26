import {
  SafeAreaProvider,
  SafeAreaListener
} from 'react-native-safe-area-context'
import { Uniwind } from 'uniwind'

export function SafeArea({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaProvider>
      <SafeAreaListener
        onChange={({ insets }) => {
          Uniwind.updateInsets(insets)
        }}
      >
        {children}
      </SafeAreaListener>
    </SafeAreaProvider>
  )
}

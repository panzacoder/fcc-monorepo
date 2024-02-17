import { SafeAreaProvider } from 'react-native-safe-area-context'
import { SafeAreaView } from 'react-native-safe-area-context'

import { cssInterop } from 'nativewind'
cssInterop(SafeAreaView, {
  className: { target: 'style' }
})

export const SafeArea = SafeAreaProvider

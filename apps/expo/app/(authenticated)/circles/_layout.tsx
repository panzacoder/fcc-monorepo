import { Stack } from 'expo-router/stack'

import { StackHeader } from 'app/ui/stack-header'
import { Platform } from 'react-native'

export default function Root() {
  return (
    <Stack
      screenOptions={{
        header: StackHeader,
        animation: 'simple_push',
        presentation: 'card',
        contentStyle: { backgroundColor: 'transparent' }
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Your Circles' }} />
      <Stack.Screen
        name="create"
        options={{
          headerShown: Platform.OS !== 'ios',
          title: 'Create Circle',
          presentation: 'modal',
          contentStyle: { backgroundColor: 'white' }
        }}
      />
    </Stack>
  )
}

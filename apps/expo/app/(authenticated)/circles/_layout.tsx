import { Stack } from 'expo-router/stack'

import { StackHeader } from 'app/ui/stack-header'

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
          headerShown: false,
          title: 'Create Circle',
          presentation: 'modal',
          contentStyle: { backgroundColor: 'white' }
        }}
      />
    </Stack>
  )
}

import { Stack } from 'expo-router/stack'

import { StackHeader } from 'app/ui/stack-header'

export default function Root() {
  return (
    <Stack
      screenOptions={{
        header: StackHeader,
        contentStyle: { backgroundColor: 'transparent' }
      }}
    />
  )
}

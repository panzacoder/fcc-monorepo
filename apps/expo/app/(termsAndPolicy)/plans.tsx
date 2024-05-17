import { PlansScreen } from 'app/features/plans/screen'
import { Stack } from 'expo-router'
export default function Plans() {
  return (
    <>
      <Stack.Screen options={{ title: '' }} />
      <PlansScreen />
    </>
  )
}

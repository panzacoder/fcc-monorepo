import { CirclesListScreen } from 'app/features/circles/screen'
import { Stack } from 'expo-router'

export default function CirclesTab() {
  return (
    <>
      <Stack.Screen options={{ title: 'Your Circles' }} />
      <CirclesListScreen />
    </>
  )
}

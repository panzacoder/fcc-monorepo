import { CircleDetailsScreen } from 'app/features/circleDetails/screen'
import { Stack } from 'expo-router'

export default function CircleDetails() {
  return (
    <>
      <Stack.Screen options={{ title: 'Circle Details', headerShown: false }} />
      <CircleDetailsScreen />
    </>
  )
}

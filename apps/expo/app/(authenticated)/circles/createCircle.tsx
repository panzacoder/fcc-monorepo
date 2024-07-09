import { CreateCircleScreen } from 'app/features/createCircle/screen'
import { Stack } from 'expo-router'

export default function CreateCircle() {
  return (
    <>
      <Stack.Screen options={{ title: 'Create Circle', headerShown: false }} />
      <CreateCircleScreen />
    </>
  )
}

import { AddEditLocationScreen } from 'app/features/addEditLocation/screen'
import { Stack } from 'expo-router'
export default function AddEditLocation() {
  return (
    <>
      <Stack.Screen options={{ title: 'Add Location', headerShown: false }} />
      <AddEditLocationScreen />
    </>
  )
}

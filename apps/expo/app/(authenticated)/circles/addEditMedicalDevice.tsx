import { AddEditMedicalDeviceScreen } from 'app/features/addEditMedicalDevice/screen'
import { Stack } from 'expo-router'
export default function AddEditMedicalDevice() {
  return (
    <>
      <Stack.Screen
        options={{ title: 'Add Medical Device', headerShown: false }}
      />
      <AddEditMedicalDeviceScreen />
    </>
  )
}

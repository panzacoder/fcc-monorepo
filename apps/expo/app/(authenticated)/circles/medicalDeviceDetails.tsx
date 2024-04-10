import { MedicalDevicesDetailsScreen } from 'app/features/medicalDevicesDetails/screen'
import { Stack } from 'expo-router'
export default function MedicalDeviceDetails() {
  return (
    <>
      <Stack.Screen options={{ title: 'Details' }} />
      <MedicalDevicesDetailsScreen />
    </>
  )
}

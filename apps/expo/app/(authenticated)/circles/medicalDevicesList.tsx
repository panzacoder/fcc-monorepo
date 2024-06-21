import { MedicalDevicesListScreen } from 'app/features/medicalDevicesList/screen'
import { Stack } from 'expo-router'
export default function MedicalDevices() {
  return (
    <>
      <Stack.Screen
        options={{ title: 'Medical Devices', headerShown: false }}
      />
      <MedicalDevicesListScreen />
    </>
  )
}

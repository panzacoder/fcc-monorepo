import { PrescriptionDetailsScreen } from 'app/features/prescriptionDetails/screen'
import { Stack } from 'expo-router'
export default function PrescriptionDetails() {
  return (
    <>
      <Stack.Screen
        options={{ title: 'Prescription Details', headerShown: false }}
      />
      <PrescriptionDetailsScreen />
    </>
  )
}

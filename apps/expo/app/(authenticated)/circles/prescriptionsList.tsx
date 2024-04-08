import { PrescriptionsListScreen } from 'app/features/prescriptionsList/screen'
import { Stack } from 'expo-router'
export default function PrescriptionsList() {
  return (
    <>
      <Stack.Screen options={{ title: 'Prescriptions' }} />
      <PrescriptionsListScreen />
    </>
  )
}

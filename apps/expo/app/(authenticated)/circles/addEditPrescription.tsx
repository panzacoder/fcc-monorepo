import { AddEditPrescriptionScreen } from 'app/features/addEditPrescription/screen'
import { Stack } from 'expo-router'
export default function AddEditPrescription() {
  return (
    <>
      <Stack.Screen options={{ title: 'Add Prescription' }} />
      <AddEditPrescriptionScreen />
    </>
  )
}

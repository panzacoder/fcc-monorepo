import { AddEditCaregiverScreen } from 'app/features/addEditCaregiver/screen'
import { Stack } from 'expo-router'
export default function AddEditCaregiver() {
  return (
    <>
      <Stack.Screen options={{ title: 'Add Caregiver', headerShown: false }} />
      <AddEditCaregiverScreen />
    </>
  )
}

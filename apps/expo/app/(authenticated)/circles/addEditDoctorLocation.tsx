import { AddEditDoctorLocationScreen } from 'app/features/addEditDoctorLocation/screen'
import { Stack } from 'expo-router'
export default function AddEditDoctorLocation() {
  return (
    <>
      <Stack.Screen options={{ title: 'Add Location' }} />
      <AddEditDoctorLocationScreen />
    </>
  )
}

import { AddEditDoctorScreen } from 'app/features/addEditDoctor/screen'
import { Stack } from 'expo-router'
export default function AddEditDoctor() {
  return (
    <>
      <Stack.Screen options={{ title: 'Add Doctor', headerShown: false }} />
      <AddEditDoctorScreen />
    </>
  )
}

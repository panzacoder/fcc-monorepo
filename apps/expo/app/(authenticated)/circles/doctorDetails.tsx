import { DoctorDetailsScreen } from 'app/features/doctorDetails/screen'
import { Stack } from 'expo-router'
export default function DoctorDetails() {
  return (
    <>
      <Stack.Screen options={{ title: 'Doctor Details' }} />
      <DoctorDetailsScreen />
    </>
  )
}

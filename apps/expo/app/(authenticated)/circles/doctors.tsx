import { DoctorsScreen } from 'app/features/doctors/screen'
import { Stack } from 'expo-router'
export default function Doctors() {
  return (
    <>
      <Stack.Screen options={{ title: 'Doctors' }} />
      <DoctorsScreen />
    </>
  )
}

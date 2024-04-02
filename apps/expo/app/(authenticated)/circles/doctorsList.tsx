import { DoctorsListScreen } from 'app/features/doctorsList/screen'
import { Stack } from 'expo-router'
export default function Doctors() {
  return (
    <>
      <Stack.Screen options={{ title: 'Doctors' }} />
      <DoctorsListScreen />
    </>
  )
}

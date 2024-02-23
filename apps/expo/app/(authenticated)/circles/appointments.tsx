import { AppointmentsScreen } from 'app/features/appointments/screen'
import { Stack } from 'expo-router'
export default function Appointments() {
  return (
    <>
      <Stack.Screen options={{ title: 'Appointments' }} />
      <AppointmentsScreen />
    </>
  )
}

import { AppointmentsListScreen } from 'app/features/appointmentsList/screen'
import { Stack } from 'expo-router'
export default function Appointments() {
  return (
    <>
      <Stack.Screen options={{ title: 'Appointments' }} />
      <AppointmentsListScreen />
    </>
  )
}

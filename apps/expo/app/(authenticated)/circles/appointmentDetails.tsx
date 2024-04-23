import { AppointmentDetailsScreen } from 'app/features/appointmentDetails/screen'
import { Stack } from 'expo-router'
export default function AppointmentDetails() {
  return (
    <>
      <Stack.Screen options={{ title: 'Appointment Details' }} />
      <AppointmentDetailsScreen />
    </>
  )
}

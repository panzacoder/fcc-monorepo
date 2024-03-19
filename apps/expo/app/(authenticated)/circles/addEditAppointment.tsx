import { AddEditAppointmentScreen } from 'app/features/addEditAppointment/screen'
import { Stack } from 'expo-router'
export default function AddEditAppointment() {
  return (
    <>
      <Stack.Screen options={{ title: 'Add Appointment' }} />
      <AddEditAppointmentScreen />
    </>
  )
}

import { EventDetailsScreen } from 'app/features/eventDetails/screen'
import { Stack } from 'expo-router'
export default function AppointmentDetails() {
  return (
    <>
      <Stack.Screen options={{ title: 'Details' }} />
      <EventDetailsScreen />
    </>
  )
}

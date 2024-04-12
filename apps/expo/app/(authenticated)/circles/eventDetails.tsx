import { EventDetailsScreen } from 'app/features/eventDetails/screen'
import { Stack } from 'expo-router'
export default function EventDetails() {
  return (
    <>
      <Stack.Screen options={{ title: 'Details' }} />
      <EventDetailsScreen />
    </>
  )
}

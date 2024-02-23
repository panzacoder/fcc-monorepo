import { EventsScreen } from 'app/features/events/screen'
import { Stack } from 'expo-router'
export default function Events() {
  return (
    <>
      <Stack.Screen options={{ title: 'Events' }} />
      <EventsScreen />
    </>
  )
}

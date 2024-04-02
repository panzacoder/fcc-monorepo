import { EventsListScreen } from 'app/features/eventsList/screen'
import { Stack } from 'expo-router'
export default function Events() {
  return (
    <>
      <Stack.Screen options={{ title: 'Events' }} />
      <EventsListScreen />
    </>
  )
}

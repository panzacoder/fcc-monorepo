import { CalendarScreen } from 'app/features/calendar/screen'
import { Stack } from 'expo-router'
export default function Calendar() {
  return (
    <>
      <Stack.Screen options={{ title: 'Calendar', headerShown: false }} />
      <CalendarScreen />
    </>
  )
}

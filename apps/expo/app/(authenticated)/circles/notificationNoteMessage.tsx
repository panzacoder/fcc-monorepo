import { NotificationNoteMessageScreen } from 'app/features/notificationNoteMessage/screen'
import { Stack } from 'expo-router'
export default function NotificationNoteMessage() {
  return (
    <>
      <Stack.Screen options={{ title: 'Messages', headerShown: false }} />
      <NotificationNoteMessageScreen />
    </>
  )
}

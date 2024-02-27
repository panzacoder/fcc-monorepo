import { MessagesScreen } from 'app/features/messages/screen'
import { Stack } from 'expo-router'
export default function Messages() {
  return (
    <>
      <Stack.Screen options={{ title: 'Messages' }} />
      <MessagesScreen />
    </>
  )
}

import { NoteMessageScreen } from 'app/features/noteMessage/screen'
import { Stack } from 'expo-router'
export default function NoteMessage() {
  return (
    <>
      <Stack.Screen options={{ title: 'Messages', headerShown: false }} />
      <NoteMessageScreen />
    </>
  )
}

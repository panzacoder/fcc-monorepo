import { HelpScreen } from 'app/features/help/screen'
import { Stack } from 'expo-router'
export default function Help() {
  return (
    <>
      <Stack.Screen options={{ title: '' }} />
      <HelpScreen />
    </>
  )
}

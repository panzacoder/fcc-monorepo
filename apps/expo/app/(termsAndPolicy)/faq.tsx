import { FaqScreen } from 'app/features/faq/screen'
import { Stack } from 'expo-router'
export default function FAQ() {
  return (
    <>
      <Stack.Screen options={{ title: 'FAQ' }} />
      <FaqScreen />
    </>
  )
}

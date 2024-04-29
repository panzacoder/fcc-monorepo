import { PrivacyPolicyScreen } from 'app/features/privacyPolicy/screen'
import { Stack } from 'expo-router'
export default function PrivacyPolicy() {
  return (
    <>
      <Stack.Screen options={{ title: 'Privacy Policy' }} />
      <PrivacyPolicyScreen />
    </>
  )
}

import { TermsAndConditonScreen } from 'app/features/termsAndCondition/screen'
import { Stack } from 'expo-router'
export default function TermsAndCondition() {
  return (
    <>
      <Stack.Screen options={{ title: 'Terms and conditions' }} />
      <TermsAndConditonScreen />
    </>
  )
}

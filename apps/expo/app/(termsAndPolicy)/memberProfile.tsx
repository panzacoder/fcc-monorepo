import { MemberProfileScreen } from 'app/features/memberProfile/screen'
import { Stack } from 'expo-router'
export default function MemberProfile() {
  return (
    <>
      <Stack.Screen options={{ title: '' }} />
      <MemberProfileScreen />
    </>
  )
}

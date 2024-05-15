import { ProfileScreen } from 'app/features/profile/screen'
import { Stack } from 'expo-router'
export default function Profile() {
  return (
    <>
      <Stack.Screen options={{ title: '' }} />
      <ProfileScreen />
    </>
  )
}

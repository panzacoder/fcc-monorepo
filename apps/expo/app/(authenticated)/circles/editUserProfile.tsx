import { EditUserProfileScreen } from 'app/features/editUserProfile/screen'
import { Stack } from 'expo-router'
export default function EditUserProfile() {
  return (
    <>
      <Stack.Screen
        options={{ title: 'Edit User Profile', headerShown: false }}
      />
      <EditUserProfileScreen />
    </>
  )
}

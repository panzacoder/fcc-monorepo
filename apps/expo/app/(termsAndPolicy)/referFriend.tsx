import { ReferFriendScreen } from 'app/features/referFriend/screen'
import { Stack } from 'expo-router'
export default function ReferFriend() {
  return (
    <>
      <Stack.Screen options={{ title: 'Refer A Friend' }} />
      <ReferFriendScreen />
    </>
  )
}

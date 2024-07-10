import { EditUserAddressScreen } from 'app/features/editUserAddress/screen'
import { Stack } from 'expo-router'
export default function EditUserAddress() {
  return (
    <>
      <Stack.Screen options={{ title: 'Edit Address', headerShown: false }} />
      <EditUserAddressScreen />
    </>
  )
}

import { CaregiversListScreen } from 'app/features/caregiversList/screen'
import { Stack } from 'expo-router'
export default function Caregivers() {
  return (
    <>
      <Stack.Screen options={{ title: 'Caregivers', headerShown: false }} />
      <CaregiversListScreen />
    </>
  )
}

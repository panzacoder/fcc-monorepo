import { CaregiversListScreen } from 'app/features/caregiersList/screen'
import { Stack } from 'expo-router'
export default function Caregivers() {
  return (
    <>
      <Stack.Screen options={{ title: 'Caregivers' }} />
      <CaregiversListScreen />
    </>
  )
}

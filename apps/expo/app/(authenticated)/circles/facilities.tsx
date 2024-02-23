import { FacilitiesScreen } from 'app/features/facilities/screen'
import { Stack } from 'expo-router'
export default function Facilities() {
  return (
    <>
      <Stack.Screen options={{ title: 'Facilities' }} />
      <FacilitiesScreen />
    </>
  )
}

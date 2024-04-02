import { FacilitiesListScreen } from 'app/features/facilitiesList/screen'
import { Stack } from 'expo-router'
export default function Facilities() {
  return (
    <>
      <Stack.Screen options={{ title: 'Facilities' }} />
      <FacilitiesListScreen />
    </>
  )
}

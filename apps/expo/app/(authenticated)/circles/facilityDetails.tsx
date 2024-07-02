import { FacilityDetailsScreen } from 'app/features/facilityDetails/screen'
import { Stack } from 'expo-router'
export default function FacilityDetails() {
  return (
    <>
      <Stack.Screen options={{ title: 'Facilities', headerShown: false }} />
      <FacilityDetailsScreen />
    </>
  )
}

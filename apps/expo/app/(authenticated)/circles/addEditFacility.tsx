import { AddEditFacilityScreen } from 'app/features/addEditFacility/screen'
import { Stack } from 'expo-router'
export default function AddEditFacility() {
  return (
    <>
      <Stack.Screen options={{ title: 'Add Facility', headerShown: false }} />
      <AddEditFacilityScreen />
    </>
  )
}

import { AddEditIncidentScreen } from 'app/features/addEditIncident/screen'
import { Stack } from 'expo-router'
export default function AddEditIncident() {
  return (
    <>
      <Stack.Screen options={{ title: 'Add Incident', headerShown: false }} />
      <AddEditIncidentScreen />
    </>
  )
}

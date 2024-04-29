import { IncidentDetailsScreen } from 'app/features/incidentDetails/screen'
import { Stack } from 'expo-router'
export default function IncidentDetails() {
  return (
    <>
      <Stack.Screen options={{ title: 'Incident Details' }} />
      <IncidentDetailsScreen />
    </>
  )
}

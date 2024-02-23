import { IncidentsScreen } from 'app/features/incidents/screen'
import { Stack } from 'expo-router'
export default function Incidents() {
  return (
    <>
      <Stack.Screen options={{ title: 'Incidents' }} />
      <IncidentsScreen />
    </>
  )
}

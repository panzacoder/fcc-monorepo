import { IncidentsListScreen } from 'app/features/incidentsList/screen'
import { Stack } from 'expo-router'
export default function Incidents() {
  return (
    <>
      <Stack.Screen options={{ title: 'Incidents' }} />
      <IncidentsListScreen />
    </>
  )
}

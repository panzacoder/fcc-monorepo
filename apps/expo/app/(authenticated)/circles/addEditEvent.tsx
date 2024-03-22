import { AddEditEventScreen } from 'app/features/addEditEvent/screen'
import { Stack } from 'expo-router'
export default function AddEditEvent() {
  return (
    <>
      <Stack.Screen options={{ title: 'Add Event' }} />
      <AddEditEventScreen />
    </>
  )
}

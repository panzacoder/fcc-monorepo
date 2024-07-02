import { CaregiverDetailsScreen } from 'app/features/caregiverDetails/screen'
import { Stack } from 'expo-router'
export default function CaregiverDetails() {
  return (
    <>
      <Stack.Screen
        options={{ title: 'Caregiver Details', headerShown: false }}
      />
      <CaregiverDetailsScreen />
    </>
  )
}

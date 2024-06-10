import { PaymentsScreen } from 'app/features/payment/screen'
import { Stack } from 'expo-router'
export default function IncidentDetails() {
  return (
    <>
      <Stack.Screen options={{ title: 'Payment' }} />
      <PaymentsScreen />
    </>
  )
}

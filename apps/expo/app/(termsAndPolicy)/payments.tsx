import { PaymentsScreen } from 'app/features/payment/screen'
import { Stack } from 'expo-router'
export default function Payments() {
  return (
    <>
      <Stack.Screen options={{ title: 'Payment' }} />
      <PaymentsScreen />
    </>
  )
}

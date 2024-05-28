import { AboutUsScreen } from 'app/features/aboutUs/screen'
import { Stack } from 'expo-router'
export default function AboutUs() {
  return (
    <>
      <Stack.Screen options={{ title: 'About Us' }} />
      <AboutUsScreen />
    </>
  )
}

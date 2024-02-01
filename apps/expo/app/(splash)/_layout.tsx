import { Slot } from 'expo-router'
import { SplashBackground } from 'app/ui/splash-background'

export default function Root() {
  return (
    <SplashBackground>
      <Slot />
    </SplashBackground>
  )
}

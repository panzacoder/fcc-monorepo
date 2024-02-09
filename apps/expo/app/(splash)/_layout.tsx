import { Slot } from 'expo-router'
import { SplashBackground } from 'app/ui/splash-background'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Root() {
  return (
    <SplashBackground>
      <SafeAreaView className="flex flex-1 items-center justify-center">
        <Slot />
      </SafeAreaView>
    </SplashBackground>
  )
}

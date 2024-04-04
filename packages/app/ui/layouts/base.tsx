import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export function BaseLayout({ children }) {
  return (
    <View className="bg-muted flex h-screen w-screen">
      <SafeAreaView className="flex h-full w-full basis-full bg-transparent">
        <View className="bg-background flex flex-1 px-4">
          <View className="bg-muted absolute -top-[18%] h-[35%] w-[120%] self-center rounded-b-full" />
          {children}
        </View>
      </SafeAreaView>
    </View>
  )
}

// import { Stack } from 'expo-router/stack'
import { useSafeArea } from 'app/provider/safe-area/use-safe-area'
import { JsStack as Stack } from '../../../layouts/js-stack'

import { TransitionPresets } from '@react-navigation/stack'
import { StackHeader } from 'app/ui/stack-header'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Root() {
  // const insets = useSafeArea()
  return (
    <SafeAreaView className="flex h-full w-full basis-full bg-transparent">
      <View className="bg-background flex flex-1 px-4">
        <View className="bg-muted absolute -top-[18%] h-[35%] w-[120%] self-center rounded-b-full" />
        <Stack
          screenOptions={{
            // ...TransitionPresets.ModalPresentationIOS,
            header: StackHeader
            // presentation: 'modal',
            // cardOverlayEnabled: false,
            // gestureEnabled: true
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              // cardStyle: { padding: insets },
              title: 'Your Circles'
            }}
          />
          <Stack.Screen
            name="create"
            options={{
              ...TransitionPresets.ModalPresentationIOS,
              presentation: 'modal',
              cardOverlayEnabled: false,
              gestureEnabled: true,

              headerShown: false,
              title: 'Create Circle'
            }}
          />
        </Stack>
      </View>
    </SafeAreaView>
  )
}

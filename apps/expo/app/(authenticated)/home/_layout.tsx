// import { Stack } from 'expo-router/stack'
import { JsStack as Stack } from '../../../layouts/js-stack'

import { TransitionPresets } from '@react-navigation/stack'
import { StackHeader } from 'app/ui/stack-header'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Root() {
  return (
    <View className="bg-background flex h-full w-full basis-full px-4">
      <View className="bg-muted absolute -top-[18%] h-[35%] w-[120%] self-center rounded-b-full" />
      <Stack
        detachInactiveScreens={false}
        screenOptions={{
          ...TransitionPresets.ModalPresentationIOS,
          header: StackHeader,
          // contentStyle: { backgroundColor: 'transparent' },
          presentation: 'modal',
          cardOverlayEnabled: false,
          gestureEnabled: true
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            // cardStyle: { backgroundColor: 'transparent' },
            title: 'Home'
          }}
        />
      </Stack>
    </View>
  )
}

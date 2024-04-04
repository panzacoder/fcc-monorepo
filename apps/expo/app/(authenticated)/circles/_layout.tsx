// import { Stack } from 'expo-router/stack'
import { JsStack as Stack } from '../../../layouts/js-stack'

import { TransitionPresets } from '@react-navigation/stack'
import { StackHeader } from 'app/ui/stack-header'

export default function Root() {
  return (
    <Stack
      screenOptions={{
        ...TransitionPresets.ModalPresentationIOS,
        header: StackHeader,
        presentation: 'modal',
        cardOverlayEnabled: false,
        gestureEnabled: true
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          cardStyle: { backgroundColor: 'transparent' },
          title: 'Your Circles'
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          headerShown: false,
          title: 'Create Circle'
          // presentation: 'modal',
          // cardStyle: { backgroundColor: 'white' }
        }}
      />
    </Stack>
  )
}

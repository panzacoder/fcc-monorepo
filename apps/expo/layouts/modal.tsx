import { JsStack as Stack } from './js-stack'
import { TransitionPresets } from '@react-navigation/stack'
import { StackHeader } from 'app/ui/stack-header'

export function Modal({ children, screenOptions, ...props }) {
  return (
    <Stack
      screenOptions={{
        ...TransitionPresets.ModalPresentationIOS,
        header: StackHeader,
        presentation: 'modal',
        cardOverlayEnabled: false,
        gestureEnabled: true,
        ...screenOptions
      }}
      {...props}
    >
      {children}
    </Stack>
  )
}

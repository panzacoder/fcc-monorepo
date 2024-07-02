import { KeyboardAvoidingView, KeyboardAvoidingViewProps } from 'react-native'

export function SafeAreaView({
  children,
  ...props
}: KeyboardAvoidingViewProps) {
  return (
    <KeyboardAvoidingView
      className="flex-column flex-1 justify-center"
      behavior="padding"
      enabled
      keyboardVerticalOffset={80}
      {...props}
    >
      {children}
    </KeyboardAvoidingView>
  )
}

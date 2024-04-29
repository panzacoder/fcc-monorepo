import { ScrollView as RNScrollView, ScrollViewProps } from 'react-native'

export function ScrollView({ children, ...props }: ScrollViewProps) {
  return (
    <RNScrollView automaticallyAdjustKeyboardInsets {...props}>
      {children}
    </RNScrollView>
  )
}

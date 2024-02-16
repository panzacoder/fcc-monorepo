import { ComponentProps } from 'react'
import { View, ScrollView, Platform } from 'react-native'
type Props = React.ComponentProps<typeof ScrollView> & {
  useWindowScrolling?: boolean
}

function NoScrollView({ ...props }: ComponentProps<typeof ScrollView>) {
  return <View {...props} />
}
export function ScreenScrollView({
  useWindowScrolling = true, // defaults to true
  ...props
}: Props) {
  const Component = Platform.select({
    web: useWindowScrolling ? NoScrollView : ScrollView,
    default: ScrollView
  })
  return <Component {...props} />
}
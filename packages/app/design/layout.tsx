import { View } from 'react-native'
import clsx from 'clsx'

export const Row = ({ className, children }) => (
  <View className={clsx('flex-row', className)}>{children}</View>
)

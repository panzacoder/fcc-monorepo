import type { ReactNode } from 'react'
import { View } from 'react-native'
import clsx from 'clsx'

export const Row = ({
  className,
  children
}: {
  className?: string
  children: ReactNode
}) => <View className={clsx('flex-row', className)}>{children}</View>

import { Image } from 'app/ui/image'
import { cn } from 'app/ui/utils'
import { View } from 'react-native'

export type CardHeaderProps = {
  className?: string
  actionSlot?: React.ReactNode
}
export function CardHeader({ className, actionSlot }: CardHeaderProps) {
  return (
    <View className={cn('mb-2 flex flex-row justify-between gap-4', className)}>
      <Image
        src={require('app/assets/fcc-logos/textStacked.png')}
        width={175}
        contentFit={'contain'}
        alt="logo"
      />
      {actionSlot}
    </View>
  )
}

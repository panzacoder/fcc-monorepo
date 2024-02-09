import { Image } from 'app/ui/image'
import { View } from 'react-native'

export type CardHeaderProps = {
  actionSlot?: React.ReactNode
}
export function CardHeader({ actionSlot }: CardHeaderProps) {
  return (
    <View className="flex flex-row justify-between gap-8">
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

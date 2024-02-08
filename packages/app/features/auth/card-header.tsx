import { Image } from 'app/ui/image'
import { View } from 'react-native'

export type CardHeaderProps = {
  actionSlot?: React.ReactNode
}
export function CardHeader({ actionSlot }: CardHeaderProps) {
  return (
    <View className="flex flex-row justify-between">
      <Image
        src={require('app/assets/fcc-logos/textStacked.png')}
        className="h-[40] w-[200]"
        width={200}
        height={40}
        contentFit={'contain'}
        alt="logo"
      />
      {actionSlot}
    </View>
  )
}

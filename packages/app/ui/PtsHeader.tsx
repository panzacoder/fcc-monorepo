import { View } from 'react-native'
import { Typography } from 'app/ui/typography'
export type Props = {
  title?: string
}
const PtsHeader = ({ title }: Props) => {
  return (
    <View className="bg-primary h-[80] w-[100%] justify-center">
      <Typography className="mt-[20] text-center text-[18px] font-bold text-white">
        {title}
      </Typography>
    </View>
  )
}
export default PtsHeader

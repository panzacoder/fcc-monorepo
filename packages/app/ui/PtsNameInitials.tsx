import { View } from 'react-native'
import { Typography } from 'app/ui/typography'
import { useRouter } from 'solito/navigation'
import { getNameInitials } from 'app/ui/utils'
export type Props = {
  fullName?: any
}
const PtsNameInitials = ({ fullName }: Props) => {
  const router = useRouter()
  return (
    <View className="bg-primary m-5 h-[40px] w-[40px] items-center justify-center rounded-[20px]">
      <Typography className="self-center text-[19px] text-white">
        {getNameInitials(fullName)}
      </Typography>
    </View>
  )
}
export default PtsNameInitials

import { View, TouchableOpacity } from 'react-native'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { useRouter } from 'solito/navigation'
export type Props = {
  title?: string
}
const PtsBackHeader = ({ title }: Props) => {
  const router = useRouter()
  return (
    <View className=" ml-[5] mt-20 w-[100%] flex-row ">
      <TouchableOpacity
        className="mx-[10px] self-center"
        onPress={() => {
          router.back()
        }}
      >
        <Feather name={'arrow-left'} size={25} color={'black'} />
      </TouchableOpacity>
      <Typography className=" text-center text-[18px] font-bold text-black">
        {title}
      </Typography>
    </View>
  )
}
export default PtsBackHeader

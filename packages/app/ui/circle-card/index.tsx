import { View, Pressable } from 'react-native'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { getNameInitials } from 'app/ui/utils'
import { useRouter } from 'solito/navigation'
import { formatUrl } from 'app/utils/format-url'

export function CircleCard(data: any) {
  const router = useRouter()
  const memberData = data.data
  let fullName = ''
  if (memberData.firstname) {
    fullName += memberData.firstname.trim() + ' '
  }
  if (memberData.lastname) {
    fullName += memberData.lastname.trim()
  }
  return (
    <View className="flex-1">
      <Pressable
        className={`border-[${memberData.role === 'My Circle' || memberData.role === 'AuthorizedCaregiver' ? '#287CFA' : '#3DC4C4'}] mt-5 w-[95%] self-center rounded-[10px] border-[2px] bg-white py-5`}
        onPress={() => {
          router.push(
            formatUrl('/circles/circleDetails', {
              fullName,
              memberData: JSON.stringify(memberData)
            })
          )
        }}
      >
        <View className="flex-row">
          <View className="flex-1 flex-row">
            <View className="bg-primary ml-5 h-[40px] w-[40px] items-center justify-center rounded-[20px]">
              <Typography className="self-center text-[19px] text-white">
                {getNameInitials(fullName)}
              </Typography>
            </View>
            <View>
              <Typography className="font-400 ml-3  text-[18px] text-black">
                {fullName}
              </Typography>
              <Typography className="font-400 ml-3 text-[14px] text-[#1A1A1A]">
                {memberData.role ? memberData.role : ''}
              </Typography>
            </View>
          </View>
          <View className="flex-row items-center">
            <View className="bg-primary flex h-[24px] w-[24px] items-center rounded-full">
              <Typography className="text-white">{'2'}</Typography>
            </View>
            <Feather
              name={'chevron-right'}
              size={25}
              color={'black'}
              className="ml-2"
            />
          </View>
        </View>
      </Pressable>
    </View>
  )
}

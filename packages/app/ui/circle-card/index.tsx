import { View, TouchableOpacity } from 'react-native'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { getNameInitials } from 'app/ui/utils'
import { useRouter } from 'solito/navigation'
// import { COLORS } from 'app/utils/colors'
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
    <View className="flex-1 bg-white">
      <View
        className={`border-[${memberData.role === 'My Circle' || memberData.role === 'AuthorizedCaregiver' ? '#287CFA' : '#3DC4C4'}] mt-5 w-[95%] self-center rounded-[10px] border-[2px] bg-white py-5`}
      >
        <View className=" flex-row">
          <View className="w-[80%] flex-row">
            <View className="bg-primary ml-5 h-[40px] w-[40px] items-center justify-center rounded-[20px]">
              <Typography className="self-center text-[19px] text-white">
                {getNameInitials(fullName)}
              </Typography>
            </View>
            <View>
              <Typography className="font-400 ml-3  text-[18px] text-black">
                {/* {fullName + "'s Circle"} */}
                {fullName}
              </Typography>
              <Typography className="font-400 ml-3 text-[14px] text-[#1A1A1A]">
                {memberData.role ? memberData.role : ''}
              </Typography>
            </View>
          </View>
          <View className="flex-row">
            <View className="bg-primary h-[24px] w-[24px] self-center rounded-[12px]">
              <Typography className="font-400 self-center text-[14px] text-white">
                {'2'}
              </Typography>
            </View>
            <TouchableOpacity
              className="ml-2 self-center"
              onPress={() => {
                router.push(
                  formatUrl('/circles/circleDetails', {
                    fullName,
                    memberData: JSON.stringify(memberData)
                  })
                )
              }}
            >
              <Feather name={'chevron-right'} size={25} color={'black'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

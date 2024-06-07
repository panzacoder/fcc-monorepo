import { View, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { getNameInitials } from 'app/ui/utils'
import PtsLoader from 'app/ui/PtsLoader'
import { useRouter } from 'solito/navigation'
import { formatUrl } from 'app/utils/format-url'
import { googleMapOpenUrl } from 'app/ui/utils'

export const CircleCard = ({ data, index, hideCirclesView }) => {
  const router = useRouter()
  const [isLoading, setLoading] = useState(false)
  const memberData = data
  let fullName = ''
  if (memberData.firstname) {
    fullName += memberData.firstname.trim() + ' '
  }
  if (memberData.lastname) {
    fullName += memberData.lastname.trim()
  }
  let sharingInfoRequestsLength = 0
  let requestsForMemberLength = 0
  if (memberData.sharingInfoRequests) {
    sharingInfoRequestsLength = memberData.sharingInfoRequests.length
  }
  if (memberData.requestsForMember) {
    requestsForMemberLength = memberData.requestsForMember.length
  }
  let iconStyle = 'mt-1 w-[33%] items-center'
  let textStyle =
    'ml-[-5px] h-[20px] w-[20px] rounded-[10px] bg-[#5ACC6C] text-center font-bold text-white'

  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />
      <TouchableOpacity
        className={`mt-3 w-full self-center rounded-[10px] border-[2px] bg-white py-2 ${memberData.role === 'My Circle' || memberData.role === 'AuthorizedCaregiver' ? 'border-[#287CFA]' : 'border-[#3DC4C4]'}`}
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
            <Feather
              name={'chevron-right'}
              size={25}
              color={'black'}
              className="ml-2"
            />
          </View>
        </View>
        <View className="ml-5 flex-row self-center">
          <View className={iconStyle}>
            {requestsForMemberLength > 0 ? (
              <View className="flex-row">
                <Feather
                  onPress={() => {
                    hideCirclesView(true, index, false)
                  }}
                  className="mt-1"
                  name={'bell'}
                  size={25}
                  color={'black'}
                />

                <Typography
                  onPress={() => {
                    hideCirclesView(true, index, false)
                  }}
                  className={textStyle}
                >
                  {requestsForMemberLength}
                </Typography>
              </View>
            ) : (
              <View />
            )}
          </View>
          <View className={iconStyle}>
            {sharingInfoRequestsLength > 0 ? (
              <View className="flex-row">
                <Feather
                  onPress={() => {
                    hideCirclesView(true, index, true)
                  }}
                  className="mt-1"
                  name={'file-text'}
                  size={25}
                  color={'black'}
                />

                <Typography
                  onPress={() => {
                    hideCirclesView(true, index, true)
                  }}
                  className={textStyle}
                >
                  {sharingInfoRequestsLength}
                </Typography>
              </View>
            ) : (
              <View />
            )}
          </View>
          <View className={iconStyle}>
            {memberData.address ? (
              <View className="flex-row">
                <Feather
                  onPress={() => {
                    googleMapOpenUrl(memberData.address)
                  }}
                  className="mt-1"
                  name={'map-pin'}
                  size={25}
                  color={'black'}
                />
              </View>
            ) : (
              <View />
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  )
}

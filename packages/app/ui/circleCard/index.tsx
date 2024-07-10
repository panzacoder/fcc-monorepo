import { View, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { getNameInitials } from 'app/ui/utils'
import PtsLoader from 'app/ui/PtsLoader'
import { Image } from 'app/ui/image'
import { useRouter } from 'expo-router'
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
  let transportationRequests = 0
  if (memberData.sharingInfoRequests) {
    sharingInfoRequestsLength = memberData.sharingInfoRequests.length
  }
  if (memberData.transportationRequests) {
    transportationRequests = memberData.transportationRequests.length
  }
  if (memberData.requestsForMember) {
    requestsForMemberLength = memberData.requestsForMember.length
  }
  let iconStyle = 'mt-1 w-[25%] items-center'
  let textStyle =
    'ml-[-5px] h-[20px] w-[20px] rounded-[10px] bg-[#5ACC6C] text-center font-bold text-white'

  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />
      <TouchableOpacity
        className={`mt-3 w-full self-center rounded-[10px] border-[2px] bg-white py-2 ${memberData.role === 'My Circle' || memberData.role === 'AuthorizedCaregiver' ? 'border-[#287CFA]' : 'border-[#3DC4C4]'}`}
        onPress={() => {
          router.dismiss(1)
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
              <TouchableOpacity
                onPress={() => {
                  hideCirclesView(true, index, false, false)
                }}
                className="flex-row"
              >
                <Feather
                  className="mt-1"
                  name={'bell'}
                  size={25}
                  color={'black'}
                />

                <Typography
                  onPress={() => {
                    hideCirclesView(true, index, false, false)
                  }}
                  className={textStyle}
                >
                  {requestsForMemberLength}
                </Typography>
              </TouchableOpacity>
            ) : (
              <View />
            )}
          </View>
          <View className={iconStyle}>
            {sharingInfoRequestsLength > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  hideCirclesView(true, index, true, false)
                }}
                className="flex-row"
              >
                <Feather
                  className="mt-1"
                  name={'file-text'}
                  size={25}
                  color={'black'}
                />

                <Typography
                  onPress={() => {
                    hideCirclesView(true, index, true, false)
                  }}
                  className={textStyle}
                >
                  {sharingInfoRequestsLength}
                </Typography>
              </TouchableOpacity>
            ) : (
              <View />
            )}
          </View>
          <View className={iconStyle}>
            {transportationRequests > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  hideCirclesView(true, index, false, true)
                }}
                className="flex-row"
              >
                <Feather
                  className="mt-1"
                  name={'truck'}
                  size={25}
                  color={'#cf8442'}
                />

                <Typography
                  onPress={() => {
                    hideCirclesView(true, index, false, true)
                  }}
                  className={textStyle}
                >
                  {transportationRequests}
                </Typography>
              </TouchableOpacity>
            ) : (
              <View />
            )}
          </View>
          <TouchableOpacity
            onPress={() => {
              googleMapOpenUrl(memberData.address)
            }}
            className={iconStyle}
          >
            {memberData.address ? (
              <View className="flex-row">
                <Image
                  className=""
                  src={require('app/assets/direction.jpg')}
                  width={30}
                  height={30}
                  contentFit={'contain'}
                  alt="logo"
                />
              </View>
            ) : (
              <View />
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  )
}

import { View, TouchableOpacity } from 'react-native'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import {
  getFullDateForCalendar,
  getNameInitials,
  getColorSet
} from 'app/ui/utils'
import store from 'app/redux/store'
import { useRouter } from 'expo-router'
import { formatUrl } from 'app/utils/format-url'
export const CardView = ({ data, trasportationClicked }) => {
  const router = useRouter()
  let memberNamesList: any = store.getState().memberNames.memberNamesList
  let memberData = data ? JSON.parse(data) : {}
  let textStyle =
    'ml-[10px] self-center text-[19px] font-bold text-black w-[80%]'
  let textStyle1 = `ml-5 text-[14px] text-[#103264] max-w-[95%] mr-4`
  let textStyle2 = `ml-5 text-[14px] font-bold max-w-[95%]`
  let fullName = ''
  let eventList = memberData.eventList ? memberData.eventList : []
  let appointmentList = memberData.appointmentList
    ? memberData.appointmentList
    : []
  if (memberData.firstname) {
    fullName += memberData.firstname.trim() + ' '
  }
  if (memberData.lastname) {
    fullName += memberData.lastname.trim()
  }
  let eventTransporationCount = 0,
    appointmentTransportationCount = 0,
    totalTransportationCount = 0
  memberData.transportationRequests.map((data: any) => {
    if (data.type === 'Appointment') {
      appointmentTransportationCount = data.count
    } else {
      eventTransporationCount = data.count
    }
  })

  totalTransportationCount =
    appointmentTransportationCount + eventTransporationCount
  let backgroundColor = getColorSet(memberNamesList.indexOf(fullName) % 26)
  return (
    <View className="flex-1">
      {eventList.length > 0 || appointmentList.length > 0 ? (
        <View className="m-auto flex-1 ">
          <View className="rounded-2xl bg-white px-2 pt-5">
            <View className="flex-row">
              <View
                className={`h-[40px] w-[40px] items-center justify-center rounded-[20px] ${backgroundColor}`}
              >
                <Typography className="self-center text-[19px] text-white">
                  {getNameInitials(fullName)}
                </Typography>
              </View>
              <TouchableOpacity
                className="ml-[5px] flex-row self-center"
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
                <Typography className={`${textStyle}`}>{fullName}</Typography>
                <Feather name={'arrow-right'} size={20} color={'black'} />
              </TouchableOpacity>
            </View>
            <View className="h-[95%] flex-1 flex-row">
              <View className="my-[5] ml-[15] h-[100%] w-[2px] bg-black" />

              <View className="flex-1">
                {appointmentList.length > 0 ? (
                  <View className="my-[2px]">
                    <Typography className={textStyle2}>
                      {'Appointment'}
                    </Typography>
                    {appointmentList.map((data: any, index: number) => {
                      let dateText = data.date
                        ? getFullDateForCalendar(
                            new Date(data.date),
                            'MMMM DD '
                          ) + ' - '
                        : ''
                      let purpose = data.purpose ? data.purpose : ''
                      return (
                        <View key={index} className="h-full w-full flex-1">
                          <Typography className={textStyle1}>
                            {dateText + purpose}
                          </Typography>
                          <View className="my-[3]  ml-[15] h-[0.5px] w-[90%] flex-1 bg-black" />
                        </View>
                      )
                    })}
                  </View>
                ) : (
                  <View />
                )}
                {eventList.length > 0 ? (
                  <View className="my-[2px]">
                    <Typography className={textStyle2}>{'Event'}</Typography>
                    {eventList.map((data: any, index: number) => {
                      let dateText = data.date
                        ? getFullDateForCalendar(
                            new Date(data.date),
                            'MMMM DD '
                          ) + ' - '
                        : ''
                      let purpose = data.purpose ? data.purpose : ''
                      purpose += data.address ? data.address : ''
                      return (
                        <View key={index}>
                          <Typography className={textStyle1}>
                            {dateText + purpose}
                          </Typography>
                          <View className="my-[3] ml-[15] h-[0.5px] w-[90%] bg-black" />
                        </View>
                      )
                    })}
                  </View>
                ) : (
                  <View />
                )}
                <View className="flex-1">
                  {totalTransportationCount > 0 ? (
                    <TouchableOpacity
                      onPress={() => {
                        trasportationClicked(memberData)
                      }}
                      className="my-[5px]"
                    >
                      <Typography className={textStyle2}>
                        {'Transportation'}
                      </Typography>

                      <View className="flex-row">
                        {appointmentTransportationCount > 0 ? (
                          <Typography className={textStyle1}>
                            {'Appointment - ' +
                              appointmentTransportationCount +
                              ' '}
                          </Typography>
                        ) : (
                          <View />
                        )}

                        {eventTransporationCount > 0 ? (
                          <Typography className={textStyle1}>
                            {'Event - ' + eventTransporationCount}
                          </Typography>
                        ) : (
                          <View />
                        )}
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <View />
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View />
      )}
    </View>
  )
}

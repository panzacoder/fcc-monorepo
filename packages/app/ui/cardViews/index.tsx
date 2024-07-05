import { View, TouchableOpacity } from 'react-native'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { getFullDateForCalendar, getNameInitials } from 'app/ui/utils'
import { useRouter } from 'expo-router'
import { formatUrl } from 'app/utils/format-url'
export const CardView = ({ data, trasportationClicked }) => {
  const router = useRouter()
  let memberData = data ? JSON.parse(data) : {}
  let textStyle =
    'ml-[10px] self-center text-[19px] font-bold text-black w-[80%]'
  let textStyle1 = `ml-5 text-[14px] text-[#103264] max-w-[95%] mr-4`
  let textStyle2 = `ml-5 text-[14px] font-bold max-w-[95%]`
  let fullName = '',
    appointmentText = ''
  let dateText = ''
  let incidentText = ''
  let incidentDateText = ''
  let eventText = ''
  let eventDateText = ''
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
  if (memberData.upcomingAppointment) {
    if (memberData.upcomingAppointment.date) {
      let date = getFullDateForCalendar(
        new Date(memberData.upcomingAppointment.date),
        'MMMM DD '
      )
      dateText += date + ' - '
    }
    if (
      memberData.upcomingAppointment &&
      memberData.upcomingAppointment.purpose
    ) {
      appointmentText += memberData.upcomingAppointment.purpose
    }
    if (
      memberData.upcomingAppointment &&
      memberData.upcomingAppointment.location
    ) {
      appointmentText += ' , ' + memberData.upcomingAppointment.location
    }
  }
  if (memberData.recentIncident) {
    if (memberData.recentIncident.date) {
      let date = getFullDateForCalendar(
        new Date(memberData.recentIncident.date),
        'MMMM DD '
      )
      incidentDateText += date + ' - '
    }
    if (memberData.recentIncident && memberData.recentIncident.title !== '') {
      incidentText += memberData.recentIncident.title + ', '
    }
    if (
      memberData.recentIncident &&
      memberData.recentIncident.location !== ''
    ) {
      incidentText += memberData.recentIncident.location
    }
  }
  if (memberData.upcomingEvent) {
    if (memberData.upcomingEvent.date) {
      let date = getFullDateForCalendar(
        new Date(memberData.upcomingEvent.date),
        'MMMM DD '
      )
      eventText += date + ' - '
    }
    if (memberData.upcomingEvent && memberData.upcomingEvent.title !== '') {
      eventText += memberData.upcomingEvent.title + ', '
    }
    if (memberData.upcomingEvent && memberData.upcomingEvent.location !== '') {
      eventText += memberData.upcomingEvent.location
    }
  }
  async function transportClicked() {
    console.log('transportClicked')
  }
  const showRequestModal = () => {
    return (
      <View
        style={{
          backgroundColor: 'white'
        }}
        className="my-2 max-h-[90%] w-[95%] self-center rounded-[15px] border-[1px] border-[#e0deda] "
      >
        <View className="bg-primary h-[50] w-full flex-row rounded-tl-[15px] rounded-tr-[15px]">
          <Typography className=" w-full self-center text-center font-bold text-white">{`Transportation`}</Typography>
        </View>
      </View>
    )
  }
  return (
    <View className="flex-1">
      {memberData.upcomingAppointment ||
      memberData.recentIncident ||
      memberData.upcomingEvent ? (
        <View className="m-auto flex-1 ">
          <View className="rounded-2xl bg-white px-2 pt-5">
            <View className="flex-row">
              <View className="bg-primary h-[40px] w-[40px] items-center justify-center rounded-[20px]">
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
            <View className="h-[95%] flex-row">
              <View className="my-[5] ml-[15] h-[90%] w-[2px] bg-black" />
              <View className="my-[2px]">
                {memberData.upcomingAppointment ? (
                  <View className="my-[5px]">
                    <Typography className={textStyle2}>
                      {'Appointment'}
                    </Typography>
                    <Typography className={textStyle1}>
                      {dateText + appointmentText}
                    </Typography>
                  </View>
                ) : (
                  <View />
                )}
                {memberData.upcomingEvent ? (
                  <View className="my-[5px]">
                    <Typography className={textStyle2}>{'Event'}</Typography>
                    <Typography className={textStyle1}>
                      {eventText + eventDateText}
                    </Typography>
                  </View>
                ) : (
                  <View />
                )}
                {memberData.recentIncident ? (
                  <View className="my-[5px]">
                    <Typography className={textStyle2}>{'Incident'}</Typography>
                    <Typography className={textStyle1}>
                      {incidentDateText + incidentText}
                    </Typography>
                  </View>
                ) : (
                  <View />
                )}

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
      ) : (
        <View />
      )}
      {/* {isShowRequests ? (
        <View className="absolute top-[100] w-[95%] self-center">
          {showRequestModal()}
        </View>
      ) : (
        <View />
      )} */}
    </View>
  )
  // return (
  //   <View className="my-2 w-[90%] self-center rounded-[15px] border-[0.5px] border-gray-400 bg-[#FCF3CF] py-5"></View>
  // )
}
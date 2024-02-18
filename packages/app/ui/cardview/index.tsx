import { View, TouchableOpacity } from 'react-native'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { getFullDateForCalender, getNameInitials } from 'app/ui/utils'
import { COLORS } from 'app/utils/colors'
export function CardView(data: any) {
  let memberData = data.data
  let textStyle = 'ml-[10px] self-center text-[19px] font-bold text-black'
  let textStyle1 = `ml-5 text-[14px] text-[${COLORS.blue}]`
  let textStyle2 = 'ml-5 text-[12px] text-black'
  let textStyle3 = ' text-[12px] text-black underline'
  let fullName = '',
    appointmentText = ''
  let dateText = ''
  let locationText = ''
  let incidentText = ''
  let incidentDateText = ''
  let incidentLocationText = ''
  let eventText = ''
  let eventDateText = ''
  let eventLocationText = ''
  if (memberData.firstname) {
    fullName += memberData.firstname + ' '
  }
  if (memberData.lastname) {
    fullName += memberData.lastname
  }
  if (memberData.upcomingAppointment) {
    if (memberData.upcomingAppointment.date) {
      let date = getFullDateForCalender(
        memberData.upcomingAppointment.date,
        'MMMM DD '
      )
      dateText += date + ' - '
    }
    if (memberData.upcomingAppointment.purpose) {
      appointmentText += memberData.upcomingAppointment.purpose
    }
    if (memberData.upcomingAppointment.location) {
      appointmentText += ' with ' + memberData.upcomingAppointment.location
      locationText += memberData.upcomingAppointment.location
    }
  }
  if (memberData.recentIncident) {
    if (memberData.recentIncident.date) {
      let date = getFullDateForCalender(
        memberData.recentIncident.date,
        'MMMM DD '
      )
      incidentDateText += date + ' - '
    }
    if (memberData.recentIncident.title) {
      incidentText += memberData.recentIncident.title
    }
    if (memberData.recentIncident.location) {
      incidentText += memberData.recentIncident.location
      incidentLocationText += memberData.recentIncident.location
    }
  }
  if (memberData.upcomingEvent) {
    if (memberData.upcomingEvent.date) {
      let date = getFullDateForCalender(
        memberData.upcomingEvent.date,
        'MMMM DD '
      )
      eventText += date + ' - '
    }
    if (memberData.upcomingEvent.title) {
      eventText += memberData.upcomingEvent.title
    }
    if (memberData.upcomingEvent.location) {
      eventText += memberData.recentIncident.location
      eventLocationText += memberData.recentIncident.location
    }
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
                  {getNameInitials(
                    memberData.firstname !== undefined
                      ? memberData.firstname
                      : '',
                    memberData.lastname !== undefined ? memberData.lastname : ''
                  )}
                </Typography>
              </View>
              <Typography className={`${textStyle}`}>{fullName}</Typography>
              <TouchableOpacity
                className="ml-[5px] self-center"
                onPress={() => {}}
              >
                <Feather name={'arrow-right'} size={20} color={'black'} />
              </TouchableOpacity>
            </View>
            <View className="h-[95%] flex-row">
              <View className="my-[5] ml-[15] h-[90%] w-[2px] bg-black" />
              <View className="my-[5px]">
                {memberData.upcomingAppointment ? (
                  <View className="my-[5px]">
                    <Typography className={`${textStyle1}`}>
                      {appointmentText}
                    </Typography>
                    <View className="flex-row">
                      <Typography className={`${textStyle2}`}>
                        {dateText}
                      </Typography>
                      <Typography className={`${textStyle3}`}>
                        {locationText}
                      </Typography>
                    </View>
                  </View>
                ) : (
                  <View />
                )}
                {memberData.upcomingEvent ? (
                  <View className="my-[5px]">
                    <Typography className={`${textStyle1}`}>
                      {eventText}
                    </Typography>
                    <View className="flex-row">
                      <Typography className={`${textStyle2}`}>
                        {eventDateText}
                      </Typography>
                      <Typography className={`${textStyle3}`}>
                        {eventLocationText}
                      </Typography>
                    </View>
                  </View>
                ) : (
                  <View />
                )}
                {memberData.recentIncident ? (
                  <View className="my-[5px]">
                    <Typography className={`${textStyle1}`}>
                      {incidentText}
                    </Typography>
                    <View className="flex-row">
                      <Typography className={`${textStyle2}`}>
                        {incidentDateText}
                      </Typography>
                      <Typography className={`${textStyle3}`}>
                        {incidentLocationText}
                      </Typography>
                    </View>
                  </View>
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
    </View>
  )
}
import { Feather } from 'app/ui/icons'
import { Typography } from 'app/ui/typography'
import { isEqual, format } from 'date-fns'
import { View } from 'react-native'

type Appoointment = {
  date: string
  purpose: string
  location: string
}

type Event = {
  date: string
  title: string
}

type MemberData = {
  upcomingAppointment?: Appoointment
  upcomingEvent?: Event
}

function CalendarEntry({ date, title }) {
  const now = new Date()

  return isEqual(date, now) ? (
    <View className="ml-5 w-full flex-row">
      <View className="mr-2 w-[2px] bg-[#319D9D]" />
      <Typography className="w-[90%] text-[12px]">{title}</Typography>
    </View>
  ) : null
}

function AppointmentEntry({ memberData }: { memberData: MemberData }) {
  if (!memberData.upcomingAppointment) {
    return null
  }
  return (
    <CalendarEntry
      date={memberData.upcomingAppointment.date}
      title={memberData.upcomingAppointment.purpose}
    />
  )
}

function EventEntry({ memberData }: { memberData: MemberData }) {
  if (!memberData.upcomingEvent) {
    return null
  }
  return (
    <CalendarEntry
      date={memberData.upcomingEvent.date}
      title={memberData.upcomingEvent.title}
    />
  )
}

type TodayCardProps = {
  memberData: MemberData
  userDetails: any
}
export function TodayCard({ memberData }: TodayCardProps) {
  const now = new Date()

  return (
    <View className="mx-4 flex flex-row justify-between gap-5 rounded-[16px] bg-white p-5">
      <View className="flex-1">
        <Typography className="font-bold">{'Today'}</Typography>
        <Typography className="text-sm">
          {format(now, 'MMMM dd, yyyy')}
        </Typography>
        <AppointmentEntry memberData={memberData} />
        <EventEntry memberData={memberData} />
      </View>
      <Feather className="" name={'calendar'} size={20} color={'black'} />
    </View>
  )
}

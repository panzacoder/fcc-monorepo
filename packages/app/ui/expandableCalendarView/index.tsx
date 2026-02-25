import { View, ScrollView, TouchableOpacity } from 'react-native'
import { useState, useEffect } from 'react'
import { Typography } from 'app/ui/typography'
import PtsLoader from 'app/ui/PtsLoader'
import { useRouter } from 'expo-router'
import { formatUrl } from 'app/utils/format-url'
import { ExpandableCalendar, CalendarProvider } from 'react-native-calendars'
import { getFullDateForCalendar, getOnlyUserTimeZone } from '../utils'

import testIDs from '../../utils/testIDs'
import { logger } from 'app/utils/logger'
import { useAppSelector } from 'app/redux/hooks'

export interface CalendarEventItem {
  date: string
  type: string
  action: string
  id: number | string
  location: string
  status: string
  description: string
  title: string
}

interface ProcessedCalendarItem {
  title: string
  data: {
    hour: string
    duration: string
    title: string
    type: string
    id: number | string
    location: string
    status: string
    desc: string
  }[]
  status?: string
}

interface ExpandableCalendarViewProps {
  memberData: Record<string, unknown>
  calenderEvents: CalendarEventItem[]
  handleChange: (month: { dateString: string }) => void
}

const today = new Date().toISOString().split('T')[0] as string
export const ExpandableCalendarView = ({
  memberData,
  calenderEvents,
  handleChange
}: ExpandableCalendarViewProps) => {
  const router = useRouter()
  const userAddress = useAppSelector(
    (state) => state.userProfileState.header.address
  )
  const memberAddress = useAppSelector(
    (state) => state.currentMemberAddress.currentMemberAddress
  )
  const [isLoading, setLoading] = useState(false)
  const [markedObject, setMarkedObject] = useState({})
  useEffect(() => {
    getMarkedDates()
  }, [])
  const onDateChanged = (_date: string, _updateSource: string) => {}

  async function onMonthChange(
    month: { dateString: string },
    _updateSource: string
  ) {
    await handleChange(month)
    getMarkedDates()
  }
  async function getMarkedDates() {
    let marked: Record<
      string,
      { marked?: boolean; dots?: unknown[]; disabled?: boolean }
    > = {}
    let data = await processData(calenderEvents)
    data.forEach((item: ProcessedCalendarItem) => {
      if (
        item.data &&
        item.data.length > 0 &&
        item.data[0] &&
        Object.keys(item.data[0]).length > 0
      ) {
        let dotsColor = item.data.map(
          (items: ProcessedCalendarItem['data'][number], index: number) => {
            let color = ''
            if (String(items.type).toLowerCase() === 'appointment') {
              switch (item.status) {
                case 'Cancelled':
                  color = 'gray-400'
                  break
                case 'Completed':
                  color = '#d2bd7f'
                  break
                default:
                  color = '#0c6b25'
              }
              return {
                key: 'Appointment' + index,
                color: color
              }
            } else if (String(items.type).toLowerCase() === 'event') {
              return { key: 'Event' + index, color: '#518b9f' }
            } else {
              return { key: 'Incident' + index, color: '#c21111' }
            }
          }
        )
        marked[item.title] = { marked: true, dots: dotsColor }
      } else {
        marked[item.title] = { disabled: true }
      }
    })
    logger.debug('marked', JSON.stringify(marked))
    setMarkedObject(marked)
  }
  async function processData(data: CalendarEventItem[]) {
    let item = data.map((calendarDetails: CalendarEventItem) => {
      let title = String(
        getFullDateForCalendar(calendarDetails.date, 'yyyy-MM-dd')
      )
      let object = {
        title: title,
        data: [
          {
            hour: getFullDateForCalendar(calendarDetails.date, 'hh:mm a'),
            duration: '1h',
            title: calendarDetails.type,
            type: calendarDetails.action,
            id: calendarDetails.id,
            location: calendarDetails.location,
            status: calendarDetails.status,
            desc: calendarDetails.description
          }
        ]
      }
      return object
    })

    const grouped = new Map<string, typeof item>()
    for (const obj of item) {
      const existing = grouped.get(obj.title)
      if (existing) {
        existing.push(obj)
      } else {
        grouped.set(obj.title, [obj])
      }
    }
    return Array.from(grouped.values()).map((group) => ({
      ...group[0]!,
      data: group.flatMap((g) => g.data)
    }))
  }

  function getStatusColor(status: string) {
    if (String(status).toLowerCase() === 'Cancelled'.toLowerCase()) {
      return 'bg-[#CCCCCC]'
    }
    if (`${status}`.toLowerCase() === 'Completed'.toLowerCase()) {
      return 'bg-[#e6dab8]'
    } else {
      return 'bg-[#D4EFDF]'
    }
  }
  function itemPressed(data: CalendarEventItem) {
    if (data.action === 'Appointment') {
      router.push(
        formatUrl('/circles/appointmentDetails', {
          appointmentDetails: JSON.stringify(data),
          memberData: JSON.stringify(memberData)
        })
      )
    } else if (data.action === 'Event') {
      router.replace(
        formatUrl('/circles/eventDetails', {
          eventDetails: JSON.stringify(data),
          memberData: JSON.stringify(memberData)
        })
      )
    } else {
      router.replace(
        formatUrl('/circles/incidentDetails', {
          incidentDetails: JSON.stringify(data),
          memberData: JSON.stringify(memberData)
        })
      )
    }
  }
  function getCard(data: CalendarEventItem, index: number) {
    let bgColor =
      data.action === 'Incident'
        ? 'bg-[#FADBD8]'
        : data.action === 'Event'
          ? 'bg-[#d6eaf8]'
          : getStatusColor(data.status)
    let days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ]
    return (
      <View className="flex-1">
        <Typography className="ml-1 w-[95%] p-2 font-bold text-gray-400">
          {`${days[new Date(data.date).getDay()]}, ${getFullDateForCalendar(data.date, 'MMM dd')}`}
        </Typography>
        <TouchableOpacity
          onPress={() => {
            itemPressed(data)
          }}
          className={`w-[95%] justify-center self-center rounded-[10px] p-3 ${bgColor}`}
        >
          <View className="flex-row">
            <Typography className="w-[70%]">
              {data.type ? data.type : ''}
            </Typography>
            <Typography className="">
              {data.date
                ? `${getFullDateForCalendar(data.date, 'hh:mm a')} ${getOnlyUserTimeZone(userAddress, memberAddress)}`
                : ''}
            </Typography>
          </View>
          <View className="flex-row">
            <Typography className="w-[70%] font-bold">
              {data.type == 'Incident' || data.type == 'Event'
                ? data.title
                : data.location}
            </Typography>
            <Typography className="">
              {data.status ? data.status : ''}
            </Typography>
          </View>
        </TouchableOpacity>
        <View className="mt-2 h-[0.5px] w-full self-center bg-gray-400" />
      </View>
    )
  }
  const marked = {
    '2024-05-17': {
      marked: true,
      dots: [
        { key: '1', color: 'red' },
        { key: '2', color: 'green' }
      ]
    }
  }
  return (
    <View className="ml-[-5] mt-2 flex-1">
      <PtsLoader loading={isLoading} />

      <CalendarProvider
        onDateChanged={onDateChanged}
        onMonthChange={onMonthChange}
        showTodayButton={true}
        date={today}
        disabledOpacity={0.6}
        todayBottomMargin={16}
      >
        <ExpandableCalendar
          testID={testIDs.expandableCalendar.CONTAINER}
          hideExtraDays={true}
          initialPosition={ExpandableCalendar.positions.OPEN}
          disableWeekScroll
          disableAllTouchEventsForDisabledDays
          firstDay={0}
          markedDates={markedObject}
          markingType={'multi-dot'}
          leftArrowImageSource={require('../../assets/previous.png')}
          rightArrowImageSource={require('../../assets/next.png')}
        />

        <ScrollView className="my-3 w-full">
          {calenderEvents.map((data: CalendarEventItem, index: number) => {
            return (
              <View key={index} className="">
                {getCard(data, index)}
              </View>
            )
          })}
        </ScrollView>
      </CalendarProvider>
    </View>
  )
}

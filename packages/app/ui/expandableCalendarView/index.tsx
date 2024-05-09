import { View, ScrollView, Pressable } from 'react-native'
import { useState } from 'react'
import { Typography } from 'app/ui/typography'
import PtsLoader from 'app/ui/PtsLoader'
import { useRouter } from 'solito/navigation'

import _ from 'lodash'
import { ExpandableCalendar, CalendarProvider } from 'react-native-calendars'
import moment from 'moment'
import { getFullDateForCalendar, getOnlyUserTimeZone } from '../utils'

import testIDs from '../../utils/testIDs'

const today = new Date().toISOString().split('T')[0]
const themeColor = '#00AAAF'
const lightThemeColor = '#EBF9F9'
export const ExpandableCalendarView = ({ calenderEvents, handleChange }) => {
  const router = useRouter()
  const [isLoading, setLoading] = useState(false)
  // console.log('data.data.calenderItemList', JSON.stringify(calenderEvents))

  const onDateChanged = (date: any, updateSource: any) => {}

  async function onMonthChange(month: any, updateSource: any) {
    // console.log('onMonthChange: ', '' + month)
    handleChange(month)
  }
  async function getStatusColorForDots(status: any) {
    if (String(status).toLowerCase() === 'Cancelled'.toLowerCase()) {
      return 'grey'
    }
    if (`${status}`.toLowerCase() === 'Completed'.toLowerCase()) {
      return '#d2bd7f'
    } else {
      return '#0c6b25'
    }
  }
  async function getMarkedDates() {
    const marked = {}
    let data = await processData(calenderEvents)
    data.forEach((item: any) => {
      if (item.data && item.data.length > 0 && !_.isEmpty(item.data[0])) {
        let dotsColor = item.data.map((items: any, index: any) => {
          if (String(items.type).toLowerCase() === 'appointment') {
            return {
              key: 'Appointment' + index,
              color: getStatusColorForDots(items.status)
            }
          } else if (String(items.type).toLowerCase() === 'event') {
            return { key: 'Event' + index, color: '#518b9f' }
          } else {
            return { key: 'Incident' + index, color: '#c21111' }
          }
        })
        marked[item.title] = { marked: true, dots: dotsColor }
      } else {
        marked[item.title] = { disabled: true }
      }
    })
    return marked
  }
  async function processData(data: any) {
    let item = data.map((calendarDetails: any) => {
      let title = String(
        getFullDateForCalendar(calendarDetails.date, 'YYYY-MM-DD')
      )
      let object = {
        title: title,
        data: [
          {
            hour: getFullDateForCalendar(calendarDetails.date, 'hh:mm A'),
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

    let sortedResult = _(item)
      .groupBy('title')
      .map((g) =>
        _.mergeWith({}, ...g, (obj: any, src: any) =>
          _.isArray(obj) ? obj.concat(src) : undefined
        )
      )
      .value()
    return sortedResult
  }

  function getStatusColor(status: any) {
    if (String(status).toLowerCase() === 'Cancelled'.toLowerCase()) {
      return 'bg-[#CCCCCC]'
    }
    if (`${status}`.toLowerCase() === 'Completed'.toLowerCase()) {
      return 'bg-[#e6dab8]'
    } else {
      return 'bg-[#D4EFDF]'
    }
  }

  function getCard(data: any, index: any) {
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
          {`${days[moment(data.date).day()]}, ${getFullDateForCalendar(data.date, 'MMM DD')}`}
        </Typography>
        <Pressable
          className={`w-[95%] justify-center self-center rounded-[10px] p-3 ${bgColor}`}
        >
          <View className="flex-row">
            <Typography className="w-[70%]">
              {data.type ? data.type : ''}
            </Typography>
            <Typography className="">
              {data.date
                ? `${getFullDateForCalendar(data.date, 'hh:mm A')} ${getOnlyUserTimeZone()}`
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
        </Pressable>
        <View className="mt-2 h-[0.5px] w-full self-center bg-gray-400" />
      </View>
    )
  }
  return (
    <View className="ml-[-5] flex-1 ">
      <PtsLoader loading={isLoading} />

      <CalendarProvider
        onDateChanged={onDateChanged}
        onMonthChange={onMonthChange}
        showTodayButton={true}
        date={today}
        disabledOpacity={0.6}
        markingType={'multi-dot'}
        renderEmptyData={() => {
          return <View />
        }}
        todayBottomMargin={16}
      >
        <ExpandableCalendar
          testID={testIDs.expandableCalendar.CONTAINER}
          hideExtraDays={true}
          initialPosition={ExpandableCalendar.positions.OPEN}
          disableWeekScroll
          disableAllTouchEventsForDisabledDays
          firstDay={0}
          markedDates={getMarkedDates()}
          markingType={'multi-dot'}
          leftArrowImageSource={require('../../assets/previous.png')}
          rightArrowImageSource={require('../../assets/next.png')}
        />

        <ScrollView className="my-3 w-full">
          {calenderEvents.map((data: any, index: number) => {
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

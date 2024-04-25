'use client'

import { useState, useEffect, useCallback } from 'react'
import { View, Alert, ScrollView, Pressable } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { Button } from 'app/ui/button'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CallPostService } from 'app/utils/fetchServerData'
import {
  BASE_URL,
  GET_CONSOLIDATED_FILTER_OPTIONS,
  GET_CONSOLIDATED_DETAILS
} from 'app/utils/urlConstants'
import store from 'app/redux/store'
import { useRouter } from 'solito/navigation'
import { formatUrl } from 'app/utils/format-url'
import { getFullDateForCalender, formatTimeToUserLocalTime } from 'app/ui/utils'
import {
  CalendarView,
  CalendarViewInput
} from '../../ui/addEditPrescription/calendar-view'
const schema = z.object({
  typeIndex: z.number()
})
let selectedType = 'All'
let typesList: object[] = [] as any
let weekFirstLastDays = [] as any
let weekDayListDates = [] as any
let weekDayUtcDates = [] as any
let weekDayList = [] as any
let fromDate = getFullDateForCalender(new Date(), 'YYYY-MM-DD') as any
let toDate = getFullDateForCalender(new Date(), 'YYYY-MM-DD') as any
let currentDate = getFullDateForCalender(new Date(), 'DD MMM YYYY') as any
export function ConsolidatedViewScreen() {
  const router = useRouter()
  const header = store.getState().headerState.header
  const userDetails = store.getState().userProfileState.header
  let memberData = {
    member: userDetails.memberId ? userDetails.memberId : ''
  }
  const [isLoading, setLoading] = useState(false)
  const [memberActivityList, setMemberActivityList] = useState([]) as any

  const [weekDays, setWeekDays] = useState([
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ])
  const [weekDaysShort, setWeekDaysShort] = useState([
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
  ])
  const [isShowCalender, setIsShowCalender] = useState(false)
  const [isDataReceived, setIsDataReceived] = useState(false)
  const [selectedDate, setSelectedDate] = useState(
    getFullDateForCalender(new Date(), 'MMM DD, YYYY')
  )
  const [currentDateUtc, setCurrentDateUtc] = useState(new Date())
  let [dayCount, setDayCount] = useState(0)
  const [currentDateForDayView, setCurrentDateForDayView] = useState(
    getFullDateForCalender(new Date(), 'DD MMM YYYY')
  )
  const [selectedStartDate, setSelectedStartDate] = useState(
    getFullDateForCalender(new Date(), 'DD MMM YYYY')
  )
  const [selectedDateUtc, setSelectedDateUtc] = useState('') as any
  const [currentDay, setCurrentDay] = useState(
    weekDays[new Date().getDay()]
  ) as any
  const [currentYear, setCurrentYear] = useState(
    currentDate.split(' ')[2]
  ) as any
  const [isShowFilter, setIsShowFilter] = useState(false)
  const [isDayView, setIsDayView] = useState(true)
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      typeIndex: 0
    },
    resolver: zodResolver(schema)
  })
  function getWeekCurrentLastDays(currentDate: any) {
    console.log('currentDate', currentDate)
    // setWeekDayList([])
    // setWeekDayUtcDates([])
    // setWeekFirstLastDays([])
    // setWeekDayListDates([])

    var curr = new Date(currentDate)
    let day = curr.getDay()
    let firstday = new Date(curr.getTime() - 60 * 60 * 24 * day * 1000)

    let previouDayUtc = new Date(firstday.getTime() - 60 * 60 * 24 * 1 * 1000)
    weekDayUtcDates.push(previouDayUtc)
    weekDayUtcDates.push(firstday)
    let fullDate = getFullDateForCalender(firstday, 'DD MMM')
    console.log('fullDate', fullDate)
    let firstDate = '   ' + weekDaysShort[0] + '\n' + fullDate
    weekDayList.push(firstDate)
    weekDayListDates.push(fullDate)
    let weekFirstDate = getFullDateForCalender(firstday, 'YYYY-MM-DD')
    weekFirstLastDays.push(weekFirstDate)
    for (let i = 1; i <= 6; i++) {
      let nextDay = new Date(firstday.getTime() + 60 * 60 * 24 * i * 1000)

      let fullDate = getFullDateForCalender(nextDay, 'DD MMM')
      let firstDate = '   ' + weekDaysShort[i] + '\n' + fullDate
      weekDayList.push(firstDate)
      weekDayListDates.push(fullDate)

      let weekDate = getFullDateForCalender(nextDay, 'YYYY-MM-DD')
      weekFirstLastDays.push(weekDate)

      let nextDayUtc = new Date(firstday.getTime() + 60 * 60 * 24 * 7 * 1000)
      weekDayUtcDates.push(nextDayUtc)
      if (i === 6) {
        let nextDayUtc = new Date(firstday.getTime() + 60 * 60 * 24 * 7 * 1000)
        weekDayUtcDates.push(nextDayUtc)
      }
    }
  }
  const getConsolidatedFilterOptions = useCallback(async () => {
    setLoading(true)
    let url = `${BASE_URL}${GET_CONSOLIDATED_FILTER_OPTIONS}`
    let dataObject = {
      header: header
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          const list: object[] = [{ label: 'All', value: 0 }]
          data.data.filterOptionTypes.map((data: any, index: any) => {
            let object = {
              label: data,
              value: index + 1
            }
            list.push(object)
          })
          typesList = list
          console.log('list', JSON.stringify(list))
        } else {
          Alert.alert('', data.message)
        }
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log('error', error)
      })
  }, [])
  const getConsolidatedDetails = useCallback(async () => {
    setLoading(true)
    let url = `${BASE_URL}${GET_CONSOLIDATED_DETAILS}`
    let dataObject = {
      header: header,
      fromdate: fromDate,
      todate: toDate
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          let list: object[] = []
          data.data.memberActivityList.map((option: any) => {
            if (isDayView) {
              if (
                currentDate ===
                getFullDateForCalender(option.date, 'DD MMM YYYY')
              ) {
                list.push(option)
              }
            }
          })
          setMemberActivityList(list)
          setIsDataReceived(true)
          // console.log('memberActivityList', JSON.stringify(memberActivityList))
        } else {
          Alert.alert('', data.message)
        }
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log('error', error)
      })
  }, [])
  useEffect(() => {
    getConsolidatedFilterOptions()
    getConsolidatedDetails()
    getWeekCurrentLastDays(new Date())
  }, [])
  const handleDateCleared = () => {}
  const handleDateChange = (date: Date) => {
    // console.log('date', date)
    setSelectedDate(getFullDateForCalender(date, 'MMM DD, YYYY'))
    setSelectedDateUtc(date)
    setIsShowCalender(false)
  }
  async function getPreviousDate() {
    setDayCount(--dayCount)
    let yesterday = new Date(currentDateUtc)
    yesterday.setUTCDate(yesterday.getDate() + dayCount)
    setCurrentDay(weekDays[new Date(yesterday).getDay()])
    setCurrentDateForDayView(getFullDateForCalender(yesterday, 'DD MMM YYYY'))
    currentDate = getFullDateForCalender(yesterday, 'DD MMM YYYY')
    toDate = getFullDateForCalender(yesterday, 'YYYY-MM-DD')
    fromDate = getFullDateForCalender(yesterday, 'YYYY-MM-DD')
    getConsolidatedDetails()
  }

  async function getNextDate() {
    setDayCount(++dayCount)
    let tomorrow = new Date(currentDateUtc)
    tomorrow.setUTCDate(tomorrow.getDate() + dayCount)
    console.log('in tomorrow', '' + tomorrow)
    setCurrentDay(weekDays[new Date(tomorrow).getDay()])
    setCurrentDateForDayView(getFullDateForCalender(tomorrow, 'DD MMM YYYY'))
    currentDate = getFullDateForCalender(tomorrow, 'DD MMM YYYY')
    toDate = getFullDateForCalender(tomorrow, 'YYYY-MM-DD')
    fromDate = getFullDateForCalender(tomorrow, 'YYYY-MM-DD')
    console.log('fromDate', '' + fromDate)
    console.log('toDate', '' + toDate)
    getConsolidatedDetails()
  }
  function getActivityName(type: any) {
    let activityName = ''
    if (type === 'Doctor Appointment') {
      activityName = 'Doctor'
    } else if (type === 'Facility Appointment') {
      activityName = 'Facility'
    } else if (type === 'Event') {
      activityName = 'Event'
    } else if (type === 'Incident') {
      activityName = 'Incident'
    }
    return activityName
  }
  function getColor(type: any) {
    let colorStr = ''
    if (type === 'Doctor Appointment') {
      colorStr = 'bg-[#e6dab8]'
    } else if (type === 'Facility Appointment') {
      colorStr = 'bg-[#D4EFDF]'
    } else if (type === 'Event') {
      colorStr = 'bg-[#d6eaf8]'
    } else if (type === 'Incident') {
      colorStr = 'bg-[#FADBD8]'
    }
    return colorStr
  }
  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />

      <View className="mt-[50px] w-full flex-row">
        <Pressable
          onPress={() => {
            setIsDayView(true)
            getConsolidatedDetails()
          }}
          className={`w-[40%] items-center justify-center ${isDayView ? 'bg-[#c2cad1]' : 'bg-white'} py-2`}
        >
          <View>
            <Feather className="" name={'calendar'} size={25} color={'black'} />
            <Typography className="mt-1 text-[14px] font-bold text-black">
              {'Day'}
            </Typography>
          </View>
        </Pressable>
        <Pressable
          onPress={() => {
            setIsDayView(false)
          }}
          className={`w-[40%] items-center justify-center ${!isDayView ? 'bg-[#c2cad1]' : 'bg-white'} py-2`}
        >
          <View>
            <Feather
              className="ml-1"
              name={'calendar'}
              size={25}
              color={'black'}
            />
            <Typography className=" mt-1 text-[14px] font-bold text-black">
              {'Week'}
            </Typography>
          </View>
        </Pressable>
        <Pressable
          onPress={() => {
            setIsShowFilter(!isShowFilter)
          }}
          className={`w-[20%] items-center justify-center bg-white py-2`}
        >
          <Feather className="ml-2" name={'filter'} size={25} color={'black'} />
        </Pressable>
      </View>
      {isShowFilter ? (
        <View className="my-2">
          <View className="mt-2 w-full justify-center rounded-[1px] shadow">
            <ControlledDropdown
              control={control}
              name="typeIndex"
              label="All"
              maxHeight={300}
              list={typesList}
              className=" w-[95%] self-center p-2"
            />
            <CalendarViewInput
              className="w-[90%] self-center"
              label="Select Date"
              value={selectedDate}
              onPress={() => {
                setIsShowCalender(true)
              }}
            />
            <View className="my-3 mb-2 flex-row self-center">
              <View className="flex-row justify-center ">
                <Button
                  className="bg-[#287CFA]"
                  title={'Filter'}
                  leadingIcon="filter"
                  variant="default"
                  // onPress={handleSubmit(filterAppointment)}
                />
                <Button
                  className="ml-5 bg-black"
                  title={'Reset'}
                  leadingIcon="rotate-ccw"
                  variant="default"
                  // onPress={handleSubmit(resetFilter)}
                />
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View />
      )}
      <View className="bg-primary h-[60] w-full justify-center">
        <View className="flex-row">
          <View className="w-[15%]">
            <Pressable
              onPress={() => {
                if (isDayView) {
                  getPreviousDate()
                }
              }}
              className="ml-5 h-[40] w-[40] items-center justify-center self-center rounded-[5px] bg-white"
            >
              <Feather
                className=""
                name={'chevron-left'}
                size={25}
                color={'black'}
              />
            </Pressable>
          </View>
          <View className="w-[70%] justify-center">
            <Typography className="text-center font-bold text-white">
              {isDayView
                ? currentDateForDayView
                : weekDaysShort[0] +
                  ', ' +
                  weekDayListDates[0] +
                  ' - ' +
                  weekDaysShort[6] +
                  ', ' +
                  weekDayListDates[6] +
                  ', ' +
                  currentYear}
            </Typography>
          </View>
          <View className="w-[15%]">
            <Pressable
              onPress={() => {
                if (isDayView) {
                  getNextDate()
                }
              }}
              className="mr-5 h-[40] w-[40] items-center justify-center self-center rounded-[5px] bg-white"
            >
              <Feather
                className=""
                name={'chevron-right'}
                size={25}
                color={'black'}
              />
            </Pressable>
          </View>
        </View>
      </View>
      {memberActivityList.length > 0 ? (
        <ScrollView className="">
          {isDayView ? (
            <View>
              {memberActivityList.map((data: any, index: number) => {
                return (
                  <Pressable
                    onPress={() => {
                      if (
                        data.type === 'Doctor Appointment' ||
                        data.type === 'Facility Appointment'
                      ) {
                        router.push(
                          formatUrl('/circles/appointmentDetails', {
                            appointmentDetails: JSON.stringify(data),
                            memberData: JSON.stringify(memberData)
                          })
                        )
                      }
                      if (data.type === 'Incident') {
                        router.push(
                          formatUrl('/circles/incidentDetails', {
                            incidentDetails: JSON.stringify(data),
                            memberData: JSON.stringify(memberData)
                          })
                        )
                      }
                      if (data.type === 'Event') {
                        router.push(
                          formatUrl('/circles/eventDetails', {
                            eventDetails: JSON.stringify(data),
                            memberData: JSON.stringify(memberData)
                          })
                        )
                      }
                    }}
                    key={index}
                    className={`mt-3 w-full flex-1 self-center rounded-[15px] border-[1px] border-gray-400 py-2 ${data.type ? getColor(data.type) : 'bg-white'}`}
                  >
                    <View className=" flex-row">
                      <Typography className="font-400 ml-5 w-[70%] max-w-[70%] font-bold text-black">
                        {data.membername ? data.membername : ''}
                      </Typography>
                      <View className="">
                        <Typography className="text-black">
                          {data.type ? getActivityName(data.type) : ''}
                        </Typography>
                      </View>
                    </View>
                    <View className=" flex-row">
                      <Typography className="font-400 ml-5 w-[70%] max-w-[70%] text-black">
                        {data.date ? formatTimeToUserLocalTime(data.date) : ''}
                      </Typography>
                      <View className="">
                        <Typography className="text-black">
                          {data.status ? data.status : ''}
                        </Typography>
                      </View>
                    </View>
                    <View className=" flex-row">
                      <Typography className="font-400 text-primary ml-5 mr-[2px] w-[95%] font-bold">
                        {data.address ? data.address : ''}
                      </Typography>
                    </View>
                    <View className=" flex-row">
                      <Typography className="font-400 ml-5 w-full text-black">
                        {data.purpose ? data.purpose : ''}
                      </Typography>
                    </View>
                    {data.hasNotes ||
                    data.hasReminders ||
                    data.hasTransportation ? (
                      <View className="my-2 h-[1px] w-[95%] self-center bg-[#86939e]" />
                    ) : (
                      <View />
                    )}

                    <View className="ml-5 flex-row self-center">
                      <View className="w-[30%]">
                        {data.hasNotes ? (
                          <View className="flex-row">
                            <Feather
                              className="ml-5 mt-1"
                              name={'message-circle'}
                              size={25}
                              color={'green'}
                            />
                            {data.unreadMessageCount > 0 ? (
                              <Typography className="bg-primary ml-[-5px] h-[20px] w-[20px] rounded-[10px] text-center font-bold text-white">
                                {data.unreadMessageCount}
                              </Typography>
                            ) : (
                              <View />
                            )}
                          </View>
                        ) : (
                          <View />
                        )}
                      </View>
                      <View className="w-[30%]">
                        {data.hasReminders ? (
                          <View className="flex-row">
                            <Feather
                              className="ml-5 mt-1"
                              name={'clock'}
                              size={25}
                              color={'red'}
                            />
                            {data.activeReminderCount > 0 ? (
                              <Typography className="bg-primary ml-[-5px] h-[20px] w-[20px] rounded-[10px] text-center font-bold text-white">
                                {data.activeReminderCount}
                              </Typography>
                            ) : (
                              <View />
                            )}
                          </View>
                        ) : (
                          <View />
                        )}
                      </View>
                      {data.hasTransportation ? (
                        <View className="w-[30%]">
                          <Feather
                            className="ml-5 mt-1"
                            name={'truck'}
                            size={25}
                            color={
                              data.transportationStatus === 'Requested'
                                ? '#cf8442'
                                : data.transportationStatus === 'Rejected'
                                  ? 'red'
                                  : 'black'
                            }
                          />
                        </View>
                      ) : (
                        <View />
                      )}
                    </View>
                  </Pressable>
                )
              })}
            </View>
          ) : (
            <View />
          )}
        </ScrollView>
      ) : (
        <View className="flex-1 justify-center self-center">
          {isDataReceived ? (
            <Typography className="text-lg font-bold">{'No Data'}</Typography>
          ) : (
            <View />
          )}
        </View>
      )}

      {isShowCalender && (
        <CalendarView
          component={'ConsolidatedView'}
          onCancel={() => setIsShowCalender(false)}
          onClear={handleDateCleared}
          calendarPickerProps={{ onDateChange: handleDateChange }}
        />
      )}
    </View>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { View, Alert, ScrollView, TouchableOpacity } from 'react-native'
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
  GET_CONSOLIDATED_DETAILS,
  GET_FILTER_CONSOLIDATED_DETAILS
} from 'app/utils/urlConstants'
import store from 'app/redux/store'
import { useRouter } from 'solito/navigation'
import { formatUrl } from 'app/utils/format-url'
import {
  getFullDateForCalendar,
  formatTimeToUserLocalTime,
  convertTimeToUserLocalTime
} from 'app/ui/utils'
import {
  CalendarView,
  CalendarViewInput
} from '../../ui/addEditPrescription/calendar-view'
const schema = z.object({
  typeIndex: z.number()
})
let selectedType = 'All'
let typesList: Array<{ id: number; title: string }> = [{ id: 1, title: 'All' }]
let weekFirstLastDays = [] as any
let weekDayListDates = [] as any
let weekDayUtcDates = [] as any
let weekDayList = [] as any
let listDayOne = [] as any
let listDayTwo = [] as any
let listDayThree = [] as any
let listDayFour = [] as any
let listDayFive = [] as any
let listDaySix = [] as any
let listDaySeven = [] as any
let fromDate = getFullDateForCalendar(new Date(), 'YYYY-MM-DD') as any
let toDate = getFullDateForCalendar(new Date(), 'YYYY-MM-DD') as any
let currentDate = getFullDateForCalendar(new Date(), 'DD MMM YYYY') as any

export function ConsolidatedViewScreen() {
  const router = useRouter()
  const header = store.getState().headerState.header
  const userDetails = store.getState().userProfileState.header
  let memberData = {
    member: userDetails.memberId ? userDetails.memberId : ''
  }
  const [isLoading, setLoading] = useState(false)
  const [memberActivityList, setMemberActivityList] = useState([]) as any

  const weekDaysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const [isShowCalender, setIsShowCalender] = useState(false)
  const [isDataReceived, setIsDataReceived] = useState(false)
  const [selectedDate, setSelectedDate] = useState(
    getFullDateForCalendar(new Date(), 'MMM DD, YYYY')
  )
  const currentDateUtc = new Date()
  const [dayCount, setDayCount] = useState(0)
  const [currentDateForDayView, setCurrentDateForDayView] = useState(
    getFullDateForCalendar(new Date(), 'DD MMM YYYY')
  )
  const [selectedDateUtc, setSelectedDateUtc] = useState(new Date()) as any
  const currentYear = currentDate.split(' ')[2]
  const [isShowFilter, setIsShowFilter] = useState(false)
  const [isDayView, setIsDayView] = useState(false)
  const [isWeekView, setIsWeekView] = useState(true)
  const { control } = useForm({
    defaultValues: {
      typeIndex: 0
    },
    resolver: zodResolver(schema)
  })
  type TypeResponse = {
    id: number
    data: string
  }
  function clearLists() {
    listDayOne = []
    listDayTwo = []
    listDayThree = []
    listDayFour = []
    listDayFive = []
    listDaySix = []
    listDaySeven = []
  }
  async function getWeekCurrentLastDays(currentDate: any) {
    console.log('currentDate', currentDate)
    weekFirstLastDays = []
    weekDayListDates = []
    weekDayUtcDates = []
    weekDayList = []
    var curr = new Date(currentDate)
    let day = curr.getDay()
    let firstday = new Date(curr.getTime() - 60 * 60 * 24 * day * 1000)

    let previouDayUtc = new Date(firstday.getTime() - 60 * 60 * 24 * 1 * 1000)
    weekDayUtcDates.push(previouDayUtc)
    weekDayUtcDates.push(firstday)
    let fullDate = getFullDateForCalendar(firstday, 'DD MMM')
    let firstDate = '   ' + weekDaysShort[0] + ' ' + fullDate
    weekDayList.push(firstDate)
    weekDayListDates.push(fullDate)
    let weekFirstDate = getFullDateForCalendar(firstday, 'YYYY-MM-DD')
    weekFirstLastDays.push(weekFirstDate)
    for (let i = 1; i <= 6; i++) {
      let nextDay = new Date(firstday.getTime() + 60 * 60 * 24 * i * 1000)

      let fullDate = getFullDateForCalendar(nextDay, 'DD MMM')
      let firstDate = '   ' + weekDaysShort[i] + ' ' + fullDate
      weekDayList.push(firstDate)
      weekDayListDates.push(fullDate)

      let weekDate = getFullDateForCalendar(nextDay, 'YYYY-MM-DD')
      weekFirstLastDays.push(weekDate)

      let nextDayUtc = new Date(firstday.getTime() + 60 * 60 * 24 * 7 * 1000)
      weekDayUtcDates.push(nextDayUtc)
      if (i === 6) {
        let nextDayUtc = new Date(firstday.getTime() + 60 * 60 * 24 * 7 * 1000)
        weekDayUtcDates.push(nextDayUtc)
      }
    }
  }
  async function setMemberActivityWithDays(list: any) {
    clearLists()
    list.forEach((data: any) => {
      const fullDate = getFullDateForCalendar(data.date, 'YYYY-MM-DD')

      switch (fullDate) {
        case weekFirstLastDays[0]:
          listDayOne.push(data)
          break
        case weekFirstLastDays[1]:
          listDayTwo.push(data)
          break
        case weekFirstLastDays[2]:
          listDayThree.push(data)
          break
        case weekFirstLastDays[3]:
          listDayFour.push(data)
          break
        case weekFirstLastDays[4]:
          listDayFive.push(data)
          break
        case weekFirstLastDays[5]:
          listDaySix.push(data)
          break
        case weekFirstLastDays[6]:
          listDaySeven.push(data)
          break
      }
    })
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
          data.data.filterOptionTypes.map((data: any, index: any) => {
            let object = {
              title: data,
              id: index + 2
            }
            typesList.push(object)
          })
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
  const getConsolidatedDetails = useCallback(
    async (fromDate: any, toDate: any) => {
      setLoading(true)
      setIsDataReceived(false)
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
            if (isDayView) {
              data.data.memberActivityList.map(async (option: any) => {
                if (
                  currentDate ===
                  getFullDateForCalendar(option.date, 'DD MMM YYYY')
                ) {
                  list.push(option)
                }
              })
            }

            await setMemberActivityList(
              isDayView ? list : data.data.memberActivityList
            )
            if (isWeekView) {
              setMemberActivityWithDays(data.data.memberActivityList)
            }
            setIsDataReceived(true)
            console.log(
              'memberActivityList',
              JSON.stringify(data.data.memberActivityList)
            )
          } else {
            Alert.alert('', data.message)
          }
          setLoading(false)
        })
        .catch((error) => {
          setLoading(false)
          console.log('error', error)
        })
    },
    []
  )
  const getFilterConsolidatedDetails = useCallback(
    async (fromDate: any, toDate: any) => {
      setLoading(true)
      let url = `${BASE_URL}${GET_FILTER_CONSOLIDATED_DETAILS}`
      let dataObject = {
        header: header,
        fromdate: fromDate,
        todate: toDate,
        type: selectedType
      }
      CallPostService(url, dataObject)
        .then(async (data: any) => {
          if (data.status === 'SUCCESS') {
            let list: object[] = []
            data.data.memberActivityList.map((option: any) => {
              if (isDayView) {
                if (
                  currentDate ===
                  getFullDateForCalendar(option.date, 'DD MMM YYYY')
                ) {
                  list.push(option)
                }
              }
            })
            setMemberActivityList(
              isDayView ? list : data.data.memberActivityList
            )
            if (isWeekView) {
              setMemberActivityWithDays(data.data.memberActivityList)
            } else {
              setCurrentDateForDayView(selectedDate)
            }
            setIsShowFilter(false)

            console.log(
              'memberActivityList',
              JSON.stringify(data.data.memberActivityList)
            )
            setIsDataReceived(true)
          } else {
            Alert.alert('', data.message)
          }
          setLoading(false)
        })
        .catch((error) => {
          setLoading(false)
          console.log('error', error)
        })
    },
    []
  )
  useEffect(() => {
    getWeekCurrentLastDays(new Date())
    getConsolidatedFilterOptions()
    getConsolidatedDetails(weekFirstLastDays[0], weekFirstLastDays[6])
  }, [])
  const handleDateCleared = () => {}
  const handleDateChange = (date: Date) => {
    fromDate = getFullDateForCalendar(date, 'YYYY-MM-DD')
    toDate = getFullDateForCalendar(date, 'YYYY-MM-DD')
    currentDate = getFullDateForCalendar(date, 'DD MMM YYYY')
    setSelectedDate(getFullDateForCalendar(date, 'MMM DD, YYYY'))
    setSelectedDateUtc(date)
    setIsShowCalender(false)
  }
  async function getPreviousWeek() {
    getWeekCurrentLastDays(weekDayUtcDates[0])
    getConsolidatedDetails(weekFirstLastDays[0], weekFirstLastDays[6])
  }
  async function getPreviousDate() {
    setDayCount((prev) => prev - 1)
    let yesterday = new Date(currentDateUtc)
    yesterday.setUTCDate(yesterday.getDate() + dayCount)
    setCurrentDateForDayView(getFullDateForCalendar(yesterday, 'DD MMM YYYY'))
    currentDate = getFullDateForCalendar(yesterday, 'DD MMM YYYY')
    toDate = getFullDateForCalendar(yesterday, 'YYYY-MM-DD')
    fromDate = getFullDateForCalendar(yesterday, 'YYYY-MM-DD')
    getConsolidatedDetails(fromDate, toDate)
  }
  async function getNextWeek() {
    getWeekCurrentLastDays(weekDayUtcDates[6])
    getConsolidatedDetails(weekFirstLastDays[0], weekFirstLastDays[6])
  }
  async function getNextDate() {
    setDayCount((prev) => prev + 1)
    let tomorrow = new Date(currentDateUtc)
    tomorrow.setUTCDate(tomorrow.getDate() + dayCount)
    setCurrentDateForDayView(getFullDateForCalendar(tomorrow, 'DD MMM YYYY'))
    currentDate = getFullDateForCalendar(tomorrow, 'DD MMM YYYY')
    toDate = getFullDateForCalendar(tomorrow, 'YYYY-MM-DD')
    fromDate = getFullDateForCalendar(tomorrow, 'YYYY-MM-DD')
    getConsolidatedDetails(fromDate, toDate)
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
      colorStr = 'bg-[#ebe4d1]'
    } else if (type === 'Facility Appointment') {
      colorStr = 'bg-[#e1ebe5]'
    } else if (type === 'Event') {
      colorStr = 'bg-[#dcebf5]'
    } else if (type === 'Incident') {
      colorStr = 'bg-[#f5dedc]'
    }
    return colorStr
  }
  function getCard(data: any, index: any) {
    return (
      <TouchableOpacity
        onPress={() => {
          if (
            data.type === 'Doctor Appointment' ||
            data.type === 'Facility Appointment'
          ) {
            router.replace(
              formatUrl('/circles/appointmentDetails', {
                appointmentDetails: JSON.stringify(data),
                memberData: JSON.stringify(memberData)
              })
            )
          }
          if (data.type === 'Incident') {
            router.replace(
              formatUrl('/circles/incidentDetails', {
                incidentDetails: JSON.stringify(data),
                memberData: JSON.stringify(memberData)
              })
            )
          }
          if (data.type === 'Event') {
            router.replace(
              formatUrl('/circles/eventDetails', {
                eventDetails: JSON.stringify(data),
                memberData: JSON.stringify(memberData)
              })
            )
          }
        }}
        key={index}
        className={`my-1 w-full flex-1 self-center rounded-[15px] border-[1px] border-gray-400 py-2 ${data.type ? getColor(data.type) : 'bg-white'}`}
      >
        <View className=" flex-row">
          <Typography className="font-400 ml-2 w-[75%] max-w-[75%] text-sm font-bold text-black">
            {data.membername ? data.membername : ''}
          </Typography>
          <View className="">
            <Typography className="text-sm text-black">
              {data.type ? getActivityName(data.type) : ''}
            </Typography>
          </View>
        </View>
        <View className=" flex-row">
          <Typography className="font-400 ml-2 w-[75%] max-w-[75%] text-sm text-black">
            {data.date ? formatTimeToUserLocalTime(data.date) : ''}
          </Typography>
          <View className="">
            <Typography className="text-sm text-black">
              {data.status ? data.status : ''}
            </Typography>
          </View>
        </View>
        <View className=" flex-row">
          <Typography className="font-400 text-primary ml-2 mr-[2px] w-[95%] text-sm font-bold">
            {data.address ? data.address : ''}
          </Typography>
        </View>
        <View className=" flex-row">
          <Typography className="font-400 ml-2 w-full text-sm text-black">
            {data.purpose ? data.purpose : ''}
          </Typography>
        </View>
        {data.hasNotes || data.hasReminders || data.hasTransportation ? (
          <View className="my-2 h-[1px] w-[95%] self-center bg-[#86939e]" />
        ) : (
          <View />
        )}

        <View className="ml-2 flex-row self-center">
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
                  <Typography className="bg-primary ml-[-5px] h-[20px] w-[20px] rounded-[10px] text-center text-sm font-bold text-white">
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
                  <Typography className="bg-primary ml-[-5px] h-[20px] w-[20px] rounded-[10px] text-center text-sm font-bold text-white">
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
      </TouchableOpacity>
    )
  }
  async function setSelectedTypeChange(value: any) {
    selectedType = value && value.title !== null ? value.title : 'All'
  }

  const dayTimesView = memberActivityList.map((data: any, index: any) => {
    return getCard(data, index)
  })
  const weekView = weekDayList.map((data: any, index: any) => {
    return (
      <View key={index} className="">
        <View className="my-4 flex-row ">
          {index === 0 ? (
            <ScrollView className="w-full ">
              <Typography className=" font-bold">{data}</Typography>
              {listDayOne.map((data: any, index: number) => {
                return (
                  <View key={index} className="">
                    {getCard(data, index)}
                  </View>
                )
              })}
            </ScrollView>
          ) : (
            <View />
          )}

          {index === 1 ? (
            <ScrollView className="w-full flex-1">
              <Typography className="font-bold">{data}</Typography>

              {listDayTwo.map((data: any, index: number) => {
                return (
                  <View key={index} className="">
                    {getCard(data, index)}
                  </View>
                )
              })}
            </ScrollView>
          ) : (
            <View />
          )}

          {index === 2 ? (
            <ScrollView className="w-full">
              <Typography className="font-bold">{data}</Typography>
              {listDayThree.map((data: any, index: number) => {
                return (
                  <View key={index} className="">
                    {getCard(data, index)}
                  </View>
                )
              })}
            </ScrollView>
          ) : (
            <View />
          )}

          {index === 3 ? (
            <ScrollView className="w-full">
              <Typography className=" font-bold">{data}</Typography>
              {listDayFour.map((data: any, index: number) => {
                return (
                  <View key={index} className="">
                    {getCard(data, index)}
                  </View>
                )
              })}
            </ScrollView>
          ) : (
            <View />
          )}

          {index === 4 ? (
            <ScrollView className="w-full">
              <Typography className="font-bold">{data}</Typography>
              {listDayFive.map((data: any, index: number) => {
                return (
                  <View key={index} className="">
                    {getCard(data, index)}
                  </View>
                )
              })}
            </ScrollView>
          ) : (
            <View />
          )}

          {index === 5 ? (
            <ScrollView className="w-full">
              <Typography className="font-bold">{data}</Typography>
              {listDaySix.map((data: any, index: number) => {
                return (
                  <View key={index} className="">
                    {getCard(data, index)}
                  </View>
                )
              })}
            </ScrollView>
          ) : (
            <View />
          )}

          {index === 6 ? (
            <ScrollView className="w-full">
              <Typography className="font-bold">{data}</Typography>
              {listDaySeven.map((data: any, index: number) => {
                return (
                  <View key={index} className="">
                    {getCard(data, index)}
                  </View>
                )
              })}
            </ScrollView>
          ) : (
            <View />
          )}
        </View>
        <View className="h-[1px] w-full bg-black" />
      </View>
    )
  })
  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />

      <View className="mt-[50px] w-full flex-row">
        <TouchableOpacity
          onPress={() => {
            setIsDayView(true)
            setIsWeekView(false)
            getConsolidatedDetails(fromDate, toDate)
          }}
          className={`w-[40%] items-center justify-center ${isDayView ? 'bg-[#c2cad1]' : 'bg-white'} py-2`}
        >
          <View>
            <Feather className="" name={'calendar'} size={25} color={'black'} />
            <Typography className="mt-1 text-[14px] font-bold text-black">
              {'Day'}
            </Typography>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            clearLists()
            setIsWeekView(true)
            setIsDayView(false)
            getConsolidatedDetails(weekFirstLastDays[0], weekFirstLastDays[6])
          }}
          className={`w-[40%] items-center justify-center ${isWeekView ? 'bg-[#c2cad1]' : 'bg-white'} py-2`}
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
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setIsShowFilter(!isShowFilter)
          }}
          className={`w-[20%] items-center justify-center bg-white py-2`}
        >
          <Feather className="ml-2" name={'filter'} size={25} color={'black'} />
        </TouchableOpacity>
      </View>
      {isShowFilter ? (
        <View className="my-2">
          <View className="mt-2 w-full justify-center gap-4 rounded-[1px] px-4 shadow">
            <ControlledDropdown
              control={control}
              name="typeIndex"
              label="All"
              maxHeight={300}
              list={typesList}
              onChangeValue={setSelectedTypeChange}
            />
            <CalendarViewInput
              label="Select Date"
              value={selectedDate}
              onPress={() => {
                setIsShowCalender(true)
              }}
            />
            <View className="my-3 mb-2 flex-row self-center">
              <View className="flex-row justify-center ">
                <Button
                  title="Filter"
                  leadingIcon="filter"
                  onPress={() => {
                    if (isDayView) {
                      getFilterConsolidatedDetails(fromDate, toDate)
                    } else {
                      getWeekCurrentLastDays(selectedDateUtc)
                      getFilterConsolidatedDetails(
                        weekFirstLastDays[0],
                        weekFirstLastDays[6]
                      )
                    }
                  }}
                />
                <Button
                  className="ml-5 bg-black"
                  title={'Reset'}
                  leadingIcon="rotate-ccw"
                  variant="default"
                  onPress={() => {
                    setSelectedDate(
                      getFullDateForCalendar(new Date(), 'MMM DD, YYYY')
                    )
                    setIsShowFilter(false)
                    if (isDayView) {
                      fromDate = getFullDateForCalendar(
                        new Date(),
                        'YYYY-MM-DD'
                      )
                      setCurrentDateForDayView(
                        getFullDateForCalendar(new Date(), 'DD MMM YYYY')
                      )
                      toDate = getFullDateForCalendar(new Date(), 'YYYY-MM-DD')
                      getConsolidatedDetails(fromDate, toDate)
                    } else {
                      getWeekCurrentLastDays(new Date())
                      getConsolidatedDetails(
                        weekFirstLastDays[0],
                        weekFirstLastDays[6]
                      )
                    }
                  }}
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
            <TouchableOpacity
              onPress={() => {
                if (isDayView) {
                  getPreviousDate()
                } else {
                  clearLists()
                  getPreviousWeek()
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
            </TouchableOpacity>
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
            <TouchableOpacity
              onPress={() => {
                if (isDayView) {
                  getNextDate()
                } else {
                  clearLists()
                  getNextWeek()
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
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {isDataReceived && memberActivityList.length > 0 ? (
        <ScrollView className="h-full">
          {isDayView ? dayTimesView : <View />}
          {isWeekView ? weekView : <View />}
        </ScrollView>
      ) : (
        <View className="flex-1 ">
          {isDataReceived && isDayView ? (
            <Typography className="mt-[50] text-center text-lg font-bold ">
              {'No Data'}
            </Typography>
          ) : isWeekView ? (
            weekView
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

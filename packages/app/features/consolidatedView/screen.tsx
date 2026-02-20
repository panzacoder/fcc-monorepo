'use client'

import { useState, useEffect, useRef } from 'react'
import { View, ScrollView, TouchableOpacity } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { Button } from 'app/ui/button'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  useConsolidatedFilterOptions,
  useConsolidatedDetails,
  useFilterConsolidatedDetails
} from 'app/data/dashboard'
import { useRouter } from 'expo-router'
import { logger } from 'app/utils/logger'
import { formatUrl } from 'app/utils/format-url'
import { getFullDateForCalendar, formatTimeToUserLocalTime } from 'app/ui/utils'
import { useAppSelector } from 'app/redux/hooks'
import {
  CalendarView,
  CalendarViewInput
} from '../../features/addEditPrescription/calendar-view'
const schema = z.object({
  typeIndex: z.number()
})
export function ConsolidatedViewScreen() {
  const router = useRouter()
  const header = useAppSelector((state) => state.headerState.header)
  const [selectedType, setSelectedType] = useState('All')
  const [fromDate, setFromDate] = useState(
    getFullDateForCalendar(new Date(), 'YYYY-MM-DD') as any
  )
  const [toDate, setToDate] = useState(
    getFullDateForCalendar(new Date(), 'YYYY-MM-DD') as any
  )
  const [currentDate, setCurrentDate] = useState(
    getFullDateForCalendar(new Date(), 'DD MMM YYYY') as any
  )
  const weekFirstLastDaysRef = useRef<any>([])
  const weekDayListDatesRef = useRef<any>([])
  const weekDayUtcDatesRef = useRef<any>([])
  const weekDayListRef = useRef<any>([])
  const listDayOneRef = useRef<any>([])
  const listDayTwoRef = useRef<any>([])
  const listDayThreeRef = useRef<any>([])
  const listDayFourRef = useRef<any>([])
  const listDayFiveRef = useRef<any>([])
  const listDaySixRef = useRef<any>([])
  const listDaySevenRef = useRef<any>([])
  const userAddress = useAppSelector(
    (state) => state.userProfileState.header.address
  )
  const memberAddress = useAppSelector(
    (state) => state.currentMemberAddress.currentMemberAddress
  )
  const userDetails = useAppSelector((state) => state.userProfileState.header)
  let memberData = {
    member: userDetails.memberId ? userDetails.memberId : ''
  }
  const [memberActivityList, setMemberActivityList] = useState([]) as any

  const weekDaysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const [isShowCalender, setIsShowCalender] = useState(false)
  const [isDataReceived, setIsDataReceived] = useState(false)
  const [typesList, setTypesList] = useState([]) as any
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
  const [isFilterActive, setIsFilterActive] = useState(false)
  const [queryFromDate, setQueryFromDate] = useState('')
  const [queryToDate, setQueryToDate] = useState('')
  const { control } = useForm({
    defaultValues: {
      typeIndex: 0
    },
    resolver: zodResolver(schema)
  })

  const { data: filterOptionsData, isLoading: isFilterOptionsLoading } =
    useConsolidatedFilterOptions(header)

  const { data: detailsData, isLoading: isDetailsLoading } =
    useConsolidatedDetails(header, {
      fromdate: queryFromDate,
      todate: queryToDate
    })

  const { data: filteredDetailsData, isLoading: isFilteredDetailsLoading } =
    useFilterConsolidatedDetails(header, {
      fromdate: queryFromDate,
      todate: queryToDate,
      type: selectedType
    })

  const isLoading =
    isFilterOptionsLoading ||
    (!isFilterActive && isDetailsLoading) ||
    (isFilterActive && isFilteredDetailsLoading)
  type TypeResponse = {
    id: number
    data: string
  }
  function clearLists() {
    listDayOneRef.current = []
    listDayTwoRef.current = []
    listDayThreeRef.current = []
    listDayFourRef.current = []
    listDayFiveRef.current = []
    listDaySixRef.current = []
    listDaySevenRef.current = []
  }
  async function getWeekCurrentLastDays(currentDateParam: any) {
    logger.debug('currentDate', currentDateParam)
    weekFirstLastDaysRef.current = []
    weekDayListDatesRef.current = []
    weekDayUtcDatesRef.current = []
    weekDayListRef.current = []
    var curr = new Date(currentDateParam)
    let day = curr.getDay()
    let firstday = new Date(curr.getTime() - 60 * 60 * 24 * day * 1000)

    let previouDayUtc = new Date(firstday.getTime() - 60 * 60 * 24 * 1 * 1000)
    weekDayUtcDatesRef.current.push(previouDayUtc)
    weekDayUtcDatesRef.current.push(firstday)
    let fullDate = getFullDateForCalendar(firstday, 'DD MMM')
    let firstDate = '   ' + weekDaysShort[0] + ' ' + fullDate
    weekDayListRef.current.push(firstDate)
    weekDayListDatesRef.current.push(fullDate)
    let weekFirstDate = getFullDateForCalendar(firstday, 'YYYY-MM-DD')
    weekFirstLastDaysRef.current.push(weekFirstDate)
    for (let i = 1; i <= 6; i++) {
      let nextDay = new Date(firstday.getTime() + 60 * 60 * 24 * i * 1000)

      let fullDate = getFullDateForCalendar(nextDay, 'DD MMM')
      let firstDate = '   ' + weekDaysShort[i] + ' ' + fullDate
      weekDayListRef.current.push(firstDate)
      weekDayListDatesRef.current.push(fullDate)

      let weekDate = getFullDateForCalendar(nextDay, 'YYYY-MM-DD')
      weekFirstLastDaysRef.current.push(weekDate)

      let nextDayUtc = new Date(firstday.getTime() + 60 * 60 * 24 * 7 * 1000)
      weekDayUtcDatesRef.current.push(nextDayUtc)
      if (i === 6) {
        let nextDayUtc = new Date(firstday.getTime() + 60 * 60 * 24 * 7 * 1000)
        weekDayUtcDatesRef.current.push(nextDayUtc)
      }
    }
  }
  async function setMemberActivityWithDays(list: any) {
    clearLists()
    list.forEach((data: any) => {
      const fullDate = getFullDateForCalendar(data.date, 'YYYY-MM-DD')

      switch (fullDate) {
        case weekFirstLastDaysRef.current[0]:
          listDayOneRef.current.push(data)
          break
        case weekFirstLastDaysRef.current[1]:
          listDayTwoRef.current.push(data)
          break
        case weekFirstLastDaysRef.current[2]:
          listDayThreeRef.current.push(data)
          break
        case weekFirstLastDaysRef.current[3]:
          listDayFourRef.current.push(data)
          break
        case weekFirstLastDaysRef.current[4]:
          listDayFiveRef.current.push(data)
          break
        case weekFirstLastDaysRef.current[5]:
          listDaySixRef.current.push(data)
          break
        case weekFirstLastDaysRef.current[6]:
          listDaySevenRef.current.push(data)
          break
      }
    })
  }
  useEffect(() => {
    getWeekCurrentLastDays(new Date())
    setQueryFromDate(weekFirstLastDaysRef.current[0])
    setQueryToDate(weekFirstLastDaysRef.current[6])
  }, [])

  useEffect(() => {
    if (filterOptionsData) {
      let list: object[] = [{ id: 1, title: 'All' }]
      filterOptionsData.filterOptionTypes.map((data: any, index: any) => {
        let object = {
          title: data,
          id: index + 2
        }
        list.push(object)
      })
      setTypesList(list)
    }
  }, [filterOptionsData])

  useEffect(() => {
    if (!isFilterActive && detailsData) {
      let list: object[] = []
      if (isDayView) {
        detailsData.memberActivityList.map(async (option: any) => {
          if (
            currentDate === getFullDateForCalendar(option.date, 'DD MMM YYYY')
          ) {
            list.push(option)
          }
        })
      }
      setMemberActivityList(isDayView ? list : detailsData.memberActivityList)
      if (isWeekView) {
        setMemberActivityWithDays(detailsData.memberActivityList)
      }
      setIsDataReceived(true)
      logger.debug(
        'memberActivityList',
        JSON.stringify(detailsData.memberActivityList)
      )
    }
  }, [detailsData, isFilterActive])

  useEffect(() => {
    if (isFilterActive && filteredDetailsData) {
      let list: object[] = []
      filteredDetailsData.memberActivityList.map((option: any) => {
        if (isDayView) {
          if (
            currentDate === getFullDateForCalendar(option.date, 'DD MMM YYYY')
          ) {
            list.push(option)
          }
        }
      })
      setMemberActivityList(
        isDayView ? list : filteredDetailsData.memberActivityList
      )
      if (isWeekView) {
        setMemberActivityWithDays(filteredDetailsData.memberActivityList)
      } else {
        setCurrentDateForDayView(selectedDate)
      }
      setIsShowFilter(false)
      logger.debug(
        'memberActivityList',
        JSON.stringify(filteredDetailsData.memberActivityList)
      )
      setIsDataReceived(true)
    }
  }, [filteredDetailsData, isFilterActive])
  const handleDateCleared = () => {}
  const handleDateChange = (date: Date) => {
    setFromDate(getFullDateForCalendar(date, 'YYYY-MM-DD'))
    setToDate(getFullDateForCalendar(date, 'YYYY-MM-DD'))
    setCurrentDate(getFullDateForCalendar(date, 'DD MMM YYYY'))
    setSelectedDate(getFullDateForCalendar(date, 'MMM DD, YYYY'))
    setSelectedDateUtc(date)
    setIsShowCalender(false)
  }
  async function getPreviousWeek() {
    getWeekCurrentLastDays(weekDayUtcDatesRef.current[0])
    setIsFilterActive(false)
    setIsDataReceived(false)
    setQueryFromDate(weekFirstLastDaysRef.current[0])
    setQueryToDate(weekFirstLastDaysRef.current[6])
  }
  async function getPreviousDate() {
    setDayCount((prev) => prev - 1)
    let yesterday = new Date(currentDateUtc)
    yesterday.setUTCDate(yesterday.getDate() + dayCount)
    setCurrentDateForDayView(getFullDateForCalendar(yesterday, 'DD MMM YYYY'))
    setCurrentDate(getFullDateForCalendar(yesterday, 'DD MMM YYYY'))
    const newDate = getFullDateForCalendar(yesterday, 'YYYY-MM-DD')
    setToDate(newDate)
    setFromDate(newDate)
    setIsFilterActive(false)
    setIsDataReceived(false)
    setQueryFromDate(newDate)
    setQueryToDate(newDate)
  }
  async function getNextWeek() {
    getWeekCurrentLastDays(weekDayUtcDatesRef.current[6])
    setIsFilterActive(false)
    setIsDataReceived(false)
    setQueryFromDate(weekFirstLastDaysRef.current[0])
    setQueryToDate(weekFirstLastDaysRef.current[6])
  }
  async function getNextDate() {
    setDayCount((prev) => prev + 1)
    let tomorrow = new Date(currentDateUtc)
    tomorrow.setUTCDate(tomorrow.getDate() + dayCount)
    setCurrentDateForDayView(getFullDateForCalendar(tomorrow, 'DD MMM YYYY'))
    setCurrentDate(getFullDateForCalendar(tomorrow, 'DD MMM YYYY'))
    const newDate = getFullDateForCalendar(tomorrow, 'YYYY-MM-DD')
    setToDate(newDate)
    setFromDate(newDate)
    setIsFilterActive(false)
    setIsDataReceived(false)
    setQueryFromDate(newDate)
    setQueryToDate(newDate)
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
            router.push(
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
            {data.date
              ? formatTimeToUserLocalTime(data.date, userAddress, memberAddress)
              : ''}
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
                      : '#4DA529'
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
    setSelectedType(value && value.title !== null ? value.title : 'All')
  }

  const dayTimesView = memberActivityList.map((data: any, index: any) => {
    return getCard(data, index)
  })
  const weekView = weekDayListRef.current.map((data: any, index: any) => {
    return (
      <View key={index} className="">
        <View className="my-4 flex-row ">
          {index === 0 ? (
            <ScrollView className="w-full ">
              <Typography className=" font-bold">{data}</Typography>
              {listDayOneRef.current.map((data: any, index: number) => {
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

              {listDayTwoRef.current.map((data: any, index: number) => {
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
              {listDayThreeRef.current.map((data: any, index: number) => {
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
              {listDayFourRef.current.map((data: any, index: number) => {
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
              {listDayFiveRef.current.map((data: any, index: number) => {
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
              {listDaySixRef.current.map((data: any, index: number) => {
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
              {listDaySevenRef.current.map((data: any, index: number) => {
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
            setIsFilterActive(false)
            setIsDataReceived(false)
            setQueryFromDate(fromDate)
            setQueryToDate(toDate)
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
            setIsFilterActive(false)
            setIsDataReceived(false)
            setQueryFromDate(weekFirstLastDaysRef.current[0])
            setQueryToDate(weekFirstLastDaysRef.current[6])
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
                    setIsFilterActive(true)
                    setIsDataReceived(false)
                    if (isDayView) {
                      setQueryFromDate(fromDate)
                      setQueryToDate(toDate)
                    } else {
                      getWeekCurrentLastDays(selectedDateUtc)
                      setQueryFromDate(weekFirstLastDaysRef.current[0])
                      setQueryToDate(weekFirstLastDaysRef.current[6])
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
                    setIsFilterActive(false)
                    setIsDataReceived(false)
                    if (isDayView) {
                      const resetDate = getFullDateForCalendar(
                        new Date(),
                        'YYYY-MM-DD'
                      )
                      setFromDate(resetDate)
                      setCurrentDateForDayView(
                        getFullDateForCalendar(new Date(), 'DD MMM YYYY')
                      )
                      setToDate(resetDate)
                      setQueryFromDate(resetDate)
                      setQueryToDate(resetDate)
                    } else {
                      getWeekCurrentLastDays(new Date())
                      setQueryFromDate(weekFirstLastDaysRef.current[0])
                      setQueryToDate(weekFirstLastDaysRef.current[6])
                    }
                  }
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
                  weekDayListDatesRef.current[0] +
                  ' - ' +
                  weekDaysShort[6] +
                  ', ' +
                  weekDayListDatesRef.current[6] +
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

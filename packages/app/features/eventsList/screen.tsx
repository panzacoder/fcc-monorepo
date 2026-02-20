'use client'

import { useState, useEffect, useRef } from 'react'
import { View, TouchableOpacity, BackHandler } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import PtsLoader from 'app/ui/PtsLoader'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { COLORS } from 'app/utils/colors'
import { Button } from 'app/ui/button'
import moment from 'moment'
import _ from 'lodash'
import { useEvents } from 'app/data/events'
import { useLocalSearchParams } from 'expo-router'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'expo-router'
import {
  formatTimeToUserLocalTime,
  getMonthsList,
  convertUserTimeToUTC
} from 'app/ui/utils'
import { useAppSelector } from 'app/redux/hooks'
import { getUserPermission } from 'app/utils/getUserPemissions'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
const schema = z.object({
  monthIndex: z.number(),
  yearIndex: z.number()
})
export type Schema = z.infer<typeof schema>
const monthsList = getMonthsList() as any
// let currentFilter = 'Upcoming'
export function EventsListScreen() {
  const eventsPrivilegesRef = useRef<any>({})
  const [selectedMonth, setSelectedMonth] = useState('All')
  const [selectedYear, setSelectedYear] = useState('All')
  const router = useRouter()
  const [currentFilter, setCurrentFilter] = useState('Upcoming')
  const [isDataReceived, setIsDataReceived] = useState(false)
  const [isShowFilter, setIsShowFilter] = useState(false)
  const [isFilter, setIsFilter] = useState(false)
  const [eventsList, setEventsList] = useState([]) as any
  const [eventsListFull, setEventsListFull] = useState([]) as any
  const header = useAppSelector((state) => state.headerState.header)
  const userAddress = useAppSelector(
    (state) => state.userProfileState.header.address
  )
  const memberAddress = useAppSelector(
    (state) => state.currentMemberAddress.currentMemberAddress
  )
  const staticData: any = useAppSelector(
    (state) => state.staticDataState.staticData
  )
  const item = useLocalSearchParams<any>()
  let memberData =
    item.memberData && item.memberData !== undefined
      ? JSON.parse(item.memberData)
      : {}
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      monthIndex: 1,
      yearIndex: 1
    },
    resolver: zodResolver(schema)
  })
  type Response = {
    id: number
    name: string
  }
  let yearList: Array<{ id: number; title: string }> = [{ id: 1, title: 'All' }]
  staticData.yearList.map(({ name, id }: Response, index: any) => {
    yearList.push({
      id: index + 2,
      title: name
    })
  })

  const { data: eventsData, isLoading } = useEvents(header, {
    memberId: memberData.member ? memberData.member : '',
    month: selectedMonth,
    year: selectedYear
  })

  useEffect(() => {
    if (eventsData) {
      if (eventsData.domainObjectPrivileges) {
        eventsPrivilegesRef.current = eventsData.domainObjectPrivileges.Event
          ? eventsData.domainObjectPrivileges.Event
          : {}
      }
      let list = eventsData.eventList ? eventsData.eventList : []
      setEventsList(list)
      setEventsListFull(list)
      getFilteredList(list, currentFilter)
      setIsDataReceived(true)
      setIsFilter(false)
    }
  }, [eventsData])

  function handleBackButtonClick() {
    let fullName = ''
    if (memberData.firstname) {
      fullName += memberData.firstname.trim() + ' '
    }
    if (memberData.lastname) {
      fullName += memberData.lastname.trim()
    }
    router.dismiss(2)
    router.push(
      formatUrl('/circles/circleDetails', {
        fullName,
        memberData: JSON.stringify(memberData)
      })
    )
    return true
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick
      )
    }
  }, [])
  function setFilteredList(filter: any) {
    setIsShowFilter(false)
    setCurrentFilter(filter)
    getFilteredList(eventsListFull, filter)
  }
  async function getFilteredList(list: any, filter: any) {
    let filteredList: any[] = []
    if (filter === 'Open Items') {
      list = _.orderBy(list, (x) => x.date, 'asc')
    } else {
      list = _.orderBy(list, (x) => x.date, 'desc')
    }
    list.map((data: any, index: any) => {
      if (filter === 'Upcoming') {
        if (
          moment(data.date).utc().isAfter(moment().utc()) &&
          String(data.status).toLocaleLowerCase() ===
            String('Scheduled').toLowerCase()
        ) {
          filteredList.push(data)
        }
      } else if (filter === 'Open Items') {
        if (
          moment(data.date)
            .utc()
            .isBefore(
              convertUserTimeToUTC(moment().utc(), userAddress, memberAddress)
            ) &&
          String(data.status).toLocaleLowerCase() ===
            String('Scheduled').toLowerCase()
        ) {
          filteredList.push(data)
        }
      } else if (filter === 'Completed') {
        if (data.status === 'Completed') {
          filteredList.push(data)
        }
      } else if (filter === 'Cancelled') {
        if (data.status === 'Cancelled') {
          filteredList.push(data)
        }
      } else if (filter === 'All') {
        filteredList = list
      }
    })
    setEventsList(filteredList)
  }
  function filterEvents(formData: Schema) {
    setSelectedMonth(
      formData.monthIndex !== -1
        ? monthsList[formData.monthIndex - 1].title
        : 'All'
    )
    setSelectedYear(
      formData.yearIndex !== -1 ? yearList[formData.yearIndex - 1].title : 'All'
    )
  }
  function resetFilter() {
    setSelectedMonth('All')
    setSelectedYear('All')
    reset({
      monthIndex: 1,
      yearIndex: 1
    })
  }

  async function setYearChange(value: any) {
    if (value === null) {
      reset({
        yearIndex: -1
      })
    }
  }
  async function setMonthChange(value: any) {
    if (value === null) {
      reset({
        monthIndex: -1
      })
    }
  }
  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />
      <PtsBackHeader title="Events" memberData={memberData} />
      <View className="flex-row ">
        <TouchableOpacity
          onPress={() => {
            setIsFilter(false)
            setIsShowFilter(!isShowFilter)
          }}
          className="w-[40%] flex-row"
        >
          <Typography className=" ml-10 mt-7 text-[14px] font-bold text-black">
            {currentFilter}
          </Typography>
          <Feather
            className="ml-2 mt-6"
            name={!isShowFilter ? 'chevron-down' : 'chevron-up'}
            size={25}
            color={'black'}
          />
        </TouchableOpacity>
        <View className="w-[35%]" />
        {getUserPermission(eventsPrivilegesRef.current).createPermission ? (
          <View className="mt-[20] self-center">
            <TouchableOpacity
              className="h-[30px] w-[30px] items-center justify-center rounded-[15px] bg-[#c5dbfd]"
              onPress={() => {
                router.push(
                  formatUrl('/circles/addEditEvent', {
                    memberData: JSON.stringify(memberData)
                  })
                )
              }}
            >
              <Feather name={'plus'} size={25} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        ) : (
          <View />
        )}
        <View className="mt-5 self-center">
          <TouchableOpacity
            onPress={() => {
              setIsShowFilter(false)
              setIsFilter(!isFilter)
            }}
            className="ml-5 h-[30px] w-[30px] items-center justify-center rounded-[5px] bg-[#c5dbfd]"
          >
            <Feather
              className=""
              name={'filter'}
              size={25}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        </View>
      </View>
      {isFilter ? (
        <View className="mt-5 rounded-[5px] border-[1px] border-gray-400 p-2">
          <View className="mt-5 w-full flex-row justify-center">
            <ControlledDropdown
              control={control}
              name="monthIndex"
              label="Month"
              maxHeight={300}
              list={monthsList}
              className="w-[45%]"
              onChangeValue={setMonthChange}
            />
            <ControlledDropdown
              control={control}
              name="yearIndex"
              label="Year"
              maxHeight={300}
              list={yearList}
              className="ml-5 w-[45%]"
              onChangeValue={setYearChange}
            />
          </View>
          <View className="flex-row self-center">
            <View className="mt-5 flex-row justify-center ">
              <Button
                className="bg-[#287CFA]"
                title={''}
                leadingIcon="filter"
                variant="default"
                onPress={handleSubmit(filterEvents)}
              />
              <Button
                className="mx-3 bg-[#287CFA]"
                title={''}
                leadingIcon="rotate-ccw"
                variant="default"
                onPress={handleSubmit(resetFilter)}
              />
              <Button
                className=" bg-[#287CFA]"
                title={''}
                leadingIcon="x"
                variant="default"
                onPress={() => {
                  setIsFilter(!isFilter)
                }}
              />
            </View>
          </View>
        </View>
      ) : (
        <View />
      )}
      {isShowFilter ? (
        <View className="ml-5 w-[40%]">
          <TouchableOpacity
            className={`${currentFilter === 'Upcoming' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
            onPress={() => {
              setFilteredList('Upcoming')
            }}
          >
            <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-t-[1px] border-gray-400 p-1 text-center font-normal">
              {'Upcoming'}
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            className={`${currentFilter === 'Open Items' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
            onPress={() => {
              setFilteredList('Open Items')
            }}
          >
            <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-gray-400 p-1 text-center font-normal">
              {'Open Items'}
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            className={`${currentFilter === 'Completed' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
            onPress={() => {
              setFilteredList('Completed')
            }}
          >
            <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-gray-400 p-1 text-center font-normal">
              {'Completed'}
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            className={`${currentFilter === 'Cancelled' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
            onPress={() => {
              setFilteredList('Cancelled')
            }}
          >
            <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-gray-400 p-1 text-center font-normal">
              {'Cancelled'}
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            className={`${currentFilter === 'All' ? 'bg-[#c9e6b1]' : 'bg-white'}`}
            onPress={() => {
              setFilteredList('All')
            }}
          >
            <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-gray-400 p-1 text-center font-normal">
              {'All'}
            </Typography>
          </TouchableOpacity>
        </View>
      ) : (
        <View />
      )}
      {!isLoading && eventsList.length > 0 ? (
        <ScrollView className="m-2 mx-5 w-full self-center">
          {eventsList.map((data: any, index: number) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  router.push(
                    formatUrl('/circles/eventDetails', {
                      eventDetails: JSON.stringify(data),
                      memberData: JSON.stringify(memberData)
                    })
                  )
                }}
                key={index}
                className="border-primary my-[5px] w-full flex-1 self-center rounded-[15px] border-[2px] bg-white py-2"
              >
                <View className="w-[90%] flex-row">
                  <View>
                    <View className="my-2 flex-row">
                      <Typography className="font-400 ml-5 w-[75%] text-black">
                        {data.date
                          ? formatTimeToUserLocalTime(
                              data.date,
                              userAddress,
                              memberAddress
                            )
                          : ''}
                      </Typography>
                      <View className="">
                        <Typography className="font-bold text-black">
                          {data.status ? data.status : ''}
                        </Typography>
                      </View>
                    </View>
                    <View className="flex-row">
                      <Typography className="font-400 ml-5 w-[90%] text-black">
                        {data.location ? data.location : ''}
                      </Typography>
                    </View>
                    <View className="flex-row">
                      <Typography className="text-primary font-400 ml-5 w-[55%] max-w-[55%] text-[16px]">
                        {data.title ? data.title : ''}
                      </Typography>
                      {data.markCompleteCancel ? (
                        <Typography className="font-400 ml-5 w-[40%] text-[#FF0000]">
                          {'Mark Complete/Cancel'}
                        </Typography>
                      ) : (
                        <View />
                      )}
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
                            className="ml-5"
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
                  </View>
                  <View className=" ml-[-10] self-center">
                    <Feather name={'chevron-right'} size={20} color={'black'} />
                  </View>
                </View>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      ) : (
        <View />
      )}
      {isDataReceived && eventsList.length === 0 ? (
        <View className="flex-1 items-center justify-center self-center">
          <Typography className="font-bold">{`No ${currentFilter !== 'All' ? currentFilter : ''} events`}</Typography>
        </View>
      ) : (
        <View />
      )}
    </View>
  )
}

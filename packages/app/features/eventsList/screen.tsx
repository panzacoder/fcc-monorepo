'use client'

import { useState, useEffect, useCallback } from 'react'
import { View, Alert, ScrollView, Pressable } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { COLORS } from 'app/utils/colors'
import { Button } from 'app/ui/button'
import moment from 'moment'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import { BASE_URL, GET_EVENTS, CREATE_EVENT } from 'app/utils/urlConstants'
import { useParams } from 'solito/navigation'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'solito/navigation'
import { formatTimeToUserLocalTime, getMonthsList } from 'app/ui/utils'
import { getUserPermission } from 'app/utils/getUserPemissions'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { AddEditEvent } from 'app/ui/addEditEvent'
let eventsPrivileges = {}
const schema = z.object({
  monthIndex: z.number(),
  yearIndex: z.number()
})
export type Schema = z.infer<typeof schema>
const yearList: object[] = [{ label: 'All', value: 0 }] as any
const monthsList = getMonthsList() as any
let selectedMonth = 'All'
let selectedYear = 'All'
// let currentFilter = 'Upcoming'
export function EventsListScreen() {
  const router = useRouter()
  const [isLoading, setLoading] = useState(false)
  const [isAddEvent, setIsAddEvent] = useState(false)
  const [currentFilter, setCurrentFilter] = useState('Upcoming')
  const [isDataReceived, setIsDataReceived] = useState(false)
  const [isShowFilter, setIsShowFilter] = useState(false)
  const [isFilter, setIsFilter] = useState(false)
  const [eventsList, setEventsList] = useState([]) as any
  const [eventsListFull, setEventsListFull] = useState([]) as any
  const header = store.getState().headerState.header
  const staticData: any = store.getState().staticDataState.staticData
  const item = useParams<any>()
  let memberData =
    item.memberData && item.memberData !== undefined
      ? JSON.parse(item.memberData)
      : {}
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      monthIndex: 0,
      yearIndex: 0
    },
    resolver: zodResolver(schema)
  })
  staticData.yearList.map((data: any, index: any) => {
    let object = {
      label: data.name,
      value: index + 1
    }
    yearList.push(object)
  })

  const getEventDetails = useCallback(async () => {
    setLoading(true)
    let url = `${BASE_URL}${GET_EVENTS}`
    let dataObject = {
      header: header,
      member: {
        id: memberData.member ? memberData.member : ''
      },
      month: selectedMonth,
      year: selectedYear
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          // console.log('data', JSON.stringify(data.data.eventList))
          if (data.data.domainObjectPrivileges) {
            eventsPrivileges = data.data.domainObjectPrivileges.Event
              ? data.data.domainObjectPrivileges.Event
              : {}
          }
          setEventsList(data.data.eventList ? data.data.eventList : [])
          setEventsListFull(data.data.eventList ? data.data.eventList : [])
          getFilteredList(
            data.data.eventList ? data.data.eventList : [],
            currentFilter
          )
          setIsDataReceived(true)
          setIsFilter(false)
          // console.log('eventList', eventsList)
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
    getEventDetails()
  }, [])
  function setFilteredList(filter: any) {
    setIsShowFilter(false)
    setCurrentFilter(filter)
    getFilteredList(eventsListFull, filter)
  }
  async function getFilteredList(list: any, filter: any) {
    let filteredList: any[] = []
    list.map((data: any, index: any) => {
      if (
        filter === 'Upcoming' &&
        moment(data.date).utc().isAfter(moment().utc()) &&
        data.status === 'Scheduled'
      ) {
        filteredList.push(data)
      } else if (data.status === filter) {
        filteredList.push(data)
      } else if (filter === 'All') {
        filteredList = list
      }
    })
    setEventsList(filteredList)
  }
  function filterEvents(formData: Schema) {
    selectedMonth = monthsList[formData.monthIndex].label
    selectedYear = yearList[formData.yearIndex].label
    getEventDetails()
  }
  function resetFilter() {
    selectedMonth = 'All'
    selectedYear = 'All'
    getEventDetails()
    reset({
      monthIndex: 0,
      yearIndex: 0
    })
  }
  async function createUpdateEvent(formData: Schema, selectedDate: any) {
    console.log('in createUpdateEvent')
    // setLoading(true)
    // let url = `${BASE_URL}${CREATE_EVENT}`

    // let dataObject: any = {
    //   header: header,
    //   event: {
    //     date: selectedDate,
    //     title: formData.title,
    //     description: formData.description,
    //     member: {
    //       id: memberData.member ? memberData.member : ''
    //     },
    //     location: formData.address,
    //     contactList: [],
    //     reminderList: []
    //   }
    // }
    // console.log('dataObject', JSON.stringify(dataObject))
    // CallPostService(url, dataObject)
    //   .then(async (data: any) => {
    //     setLoading(false)
    //     if (data.status === 'SUCCESS') {
    //       router.replace(
    //         formatUrl('/circles/eventDetails', {
    //           eventDetails: JSON.stringify(data.data.event),
    //           memberData: JSON.stringify(memberData)
    //         })
    //       )
    //     } else {
    //       Alert.alert('', data.message)
    //     }
    //     setLoading(false)
    //   })
    //   .catch((error) => {
    //     setLoading(false)
    //     console.log(error)
    //   })
  }
  async function cancelClicked() {
    setIsAddEvent(false)
  }
  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />
      <View className="flex-row ">
        <Pressable
          onPress={() => {
            setIsFilter(false)
            setIsShowFilter(!isShowFilter)
          }}
          className="w-[75%] flex-row"
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
        </Pressable>
        {getUserPermission(eventsPrivileges).createPermission ? (
          <View className="mt-[20] self-center">
            <Pressable
              className=" h-[30px] w-[30px] items-center justify-center rounded-[15px] bg-[#c5dbfd]"
              onPress={() => {
                router.push(
                  formatUrl('/circles/addEditEvent', {
                    memberData: JSON.stringify(memberData)
                  })
                )
                // setIsAddEvent(true)
              }}
            >
              <Feather name={'plus'} size={25} color={COLORS.primary} />
            </Pressable>
          </View>
        ) : (
          <View />
        )}
        <Pressable
          onPress={() => {
            setIsShowFilter(false)
            setIsFilter(!isFilter)
          }}
          className=""
        >
          <Feather
            className="ml-5 mt-6 rounded-[5px] bg-[#c5dbfd] p-[3px]"
            name={'filter'}
            size={25}
            color={COLORS.primary}
          />
        </Pressable>
      </View>
      {isFilter ? (
        <View className="mt-5 rounded-[5px] border-[1px] border-gray-400 p-2">
          <View className="mt-5 w-full flex-row justify-center">
            <ControlledDropdown
              control={control}
              name="monthIndex"
              label="All"
              maxHeight={300}
              list={monthsList}
              className="w-[45%]"
            />
            <ControlledDropdown
              control={control}
              name="yearIndex"
              label="All"
              maxHeight={300}
              list={yearList}
              className="ml-5 w-[45%]"
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
                className="ml-5 bg-[#287CFA]"
                title={''}
                leadingIcon="rotate-ccw"
                variant="default"
                onPress={handleSubmit(resetFilter)}
              />
              <Button
                className="ml-5 bg-[#287CFA]"
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
          <Pressable
            onPress={() => {
              setFilteredList('Upcoming')
            }}
          >
            <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-t-[1px] border-gray-400 p-1 text-center font-normal">
              {'Upcoming'}
            </Typography>
          </Pressable>
          <Pressable
            onPress={() => {
              setFilteredList('Completed')
            }}
          >
            <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-gray-400 p-1 text-center font-normal">
              {'Completed'}
            </Typography>
          </Pressable>
          <Pressable
            onPress={() => {
              setFilteredList('Cancelled')
            }}
          >
            <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-gray-400 p-1 text-center font-normal">
              {'Cancelled'}
            </Typography>
          </Pressable>
          <Pressable
            onPress={() => {
              setFilteredList('All')
            }}
          >
            <Typography className="border-b-[1px] border-l-[1px] border-r-[1px] border-gray-400 p-1 text-center font-normal">
              {'All'}
            </Typography>
          </Pressable>
        </View>
      ) : (
        <View />
      )}
      {eventsList.length > 0 ? (
        <ScrollView className="m-2 mx-5 w-[95%] self-center">
          {eventsList.map((data: any, index: number) => {
            return (
              <Pressable
                onPress={() => {
                  router.replace(
                    formatUrl('/circles/eventDetails', {
                      eventDetails: JSON.stringify(data),
                      memberData: JSON.stringify(memberData)
                    })
                  )
                }}
                key={index}
                className="border-primary my-[5px] w-full flex-1 self-center rounded-[15px] border-[2px] bg-white py-2"
              >
                <View className="my-2 flex-row">
                  <Typography className="text-primary font-400 ml-5 mr-5 w-[65%] max-w-[65%] text-[16px]">
                    {data.title ? data.title : ''}
                  </Typography>
                  <View className="">
                    <Typography className="font-bold text-black">
                      {data.status ? data.status : ''}
                    </Typography>
                  </View>
                </View>
                <View className="flex-row">
                  <Typography className="font-400 ml-5 w-full text-black">
                    {data.location ? data.location : ''}
                  </Typography>
                </View>
                <View className="flex-row">
                  <Typography className="font-400 ml-5 w-full text-black">
                    {data.date ? formatTimeToUserLocalTime(data.date) : ''}
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
                              : 'green'
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
      {isAddEvent ? (
        <View className="mt-2 h-full w-full items-center self-center">
          <AddEditEvent
            component={'Event'}
            createUpdateEvent={createUpdateEvent}
            cancelClicked={cancelClicked}
          />
        </View>
      ) : (
        <View />
      )}
    </View>
  )
}

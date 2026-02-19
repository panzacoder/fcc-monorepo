'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { View, Alert, TouchableOpacity, BackHandler } from 'react-native'
import { ScrollView } from 'app/ui/scroll-view'
import PtsLoader from 'app/ui/PtsLoader'
import PtsBackHeader from 'app/ui/PtsBackHeader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { COLORS } from 'app/utils/colors'
import { Button } from 'app/ui/button'
import { CallPostService } from 'app/utils/fetchServerData'
import { BASE_URL, GET_INCIDENTS } from 'app/utils/urlConstants'
import { useLocalSearchParams } from 'expo-router'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'expo-router'
import { logger } from 'app/utils/logger'
import { formatTimeToUserLocalTime, getMonthsList } from 'app/ui/utils'
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
export function IncidentsListScreen() {
  const incidentsPrivilegesRef = useRef<any>({})
  const selectedMonthRef = useRef<any>('All')
  const selectedYearRef = useRef<any>('All')
  const router = useRouter()
  const [isLoading, setLoading] = useState(false)
  const [isDataReceived, setIsDataReceived] = useState(false)
  const [isFilter, setIsFilter] = useState(false)
  const [incidentsList, setIncidentsList] = useState([]) as any
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
    item.memberData !== undefined ? JSON.parse(item.memberData) : {}
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

  const getIncidentDetails = useCallback(async () => {
    setLoading(true)
    let url = `${BASE_URL}${GET_INCIDENTS}`
    let dataObject = {
      header: header,
      incident: {
        member: {
          id: memberData.member ? memberData.member : ''
        }
      },
      month: selectedMonthRef.current,
      year: selectedYearRef.current
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          // console.log('data', JSON.stringify(data.data.eventList))
          if (data.data.domainObjectPrivileges) {
            incidentsPrivilegesRef.current = data.data.domainObjectPrivileges
              .Incident
              ? data.data.domainObjectPrivileges.Incident
              : {}
          }
          setIncidentsList(data.data.list ? data.data.list : [])
          setIsDataReceived(true)
          setIsFilter(false)
          // console.log('eventList', incidentsList)
        } else {
          Alert.alert('', data.message)
        }
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        logger.debug('error', error)
      })
  }, [])
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
    getIncidentDetails()
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick)
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick
      )
    }
  }, [])

  function filterEvents(formData: Schema) {
    selectedMonthRef.current =
      formData.monthIndex !== -1
        ? monthsList[formData.monthIndex - 1].title
        : 'All'
    selectedYearRef.current =
      formData.yearIndex !== -1 ? yearList[formData.yearIndex - 1].title : 'All'
    getIncidentDetails()
  }
  function resetFilter() {
    selectedMonthRef.current = 'All'
    selectedYearRef.current = 'All'
    getIncidentDetails()
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
      <PtsBackHeader title="Incidents" memberData={memberData} />
      <View className="flex-row">
        <View className="w-[75%]" />

        {getUserPermission(incidentsPrivilegesRef.current).createPermission ? (
          <View className="self-center">
            <TouchableOpacity
              className="h-[30px] w-[30px] items-center justify-center rounded-[15px] bg-[#c5dbfd]"
              onPress={() => {
                router.push(
                  formatUrl('/circles/addEditIncident', {
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
        <View className="self-center">
          <TouchableOpacity
            onPress={() => {
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

      {incidentsList.length > 0 ? (
        <ScrollView className="m-2 mx-5 w-full self-center">
          {incidentsList.map((data: any, index: number) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  router.push(
                    formatUrl('/circles/incidentDetails', {
                      incidentDetails: JSON.stringify(data),
                      memberData: JSON.stringify(memberData)
                    })
                  )
                }}
                key={index}
                className="border-primary my-[5px] w-full flex-1 self-center rounded-[15px] border-[2px] bg-white py-2"
              >
                <View className="w-[90%] flex-row">
                  <View>
                    {/* <View className="my-2 flex-row">
                      <Typography className="text-primary font-400 ml-5 mr-5 w-[50%] max-w-[50%] text-[16px]">
                        {data.title ? data.title : ''}
                      </Typography>
                      <View className="">
                        <Typography className="font-bold text-black w-[45%] max-w-[45%]">
                          {data.type ? data.type : ''}
                        </Typography>
                      </View>
                    </View> */}
                    <View className="w-full flex-row">
                      <Typography className="text-primary font-400 ml-5 mr-5 w-[50%] max-w-[50%]">
                        {data.title ? data.title : ''}
                      </Typography>
                      <Typography className="font-400 mr-5 w-[40%] max-w-[40%] text-right text-black">
                        {data.type ? data.type : ''}
                      </Typography>
                    </View>
                    <View className="flex-row">
                      <Typography className="font-400 ml-5 w-full text-black">
                        {data.location ? data.location : ''}
                      </Typography>
                    </View>
                    <View className="flex-row">
                      <Typography className="font-400 ml-5 w-full text-black">
                        {data.date
                          ? formatTimeToUserLocalTime(
                              data.date,
                              userAddress,
                              memberAddress
                            )
                          : ''}
                      </Typography>
                    </View>
                    {data.hasNotes ? (
                      <View className="my-2 h-[1px] w-[95%] self-center bg-[#86939e]" />
                    ) : (
                      <View />
                    )}

                    <View className="ml-5 flex-row">
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
      {isDataReceived && incidentsList.length === 0 ? (
        <View className="flex-1 items-center justify-center self-center">
          <Typography className="font-bold">{`No incidents`}</Typography>
        </View>
      ) : (
        <View />
      )}
    </View>
  )
}

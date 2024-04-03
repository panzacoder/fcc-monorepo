'use client'

import { useState, useEffect, useCallback } from 'react'
import { View, Alert, ScrollView, Pressable } from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { COLORS } from 'app/utils/colors'
import { Button } from 'app/ui/button'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import { BASE_URL, GET_INCIDENTS } from 'app/utils/urlConstants'
import { useParams } from 'solito/navigation'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'solito/navigation'
import { formatTimeToUserLocalTime, getMonthsList } from 'app/ui/utils'
import { getUserPermission } from 'app/utils/getUserPemissions'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
let incidentsPrivileges = {}
const schema = z.object({
  monthIndex: z.number(),
  yearIndex: z.number()
})
export type Schema = z.infer<typeof schema>
const yearList: object[] = [{ label: 'All', value: 0 }] as any
const monthsList = getMonthsList() as any
let selectedMonth = 'All'
let selectedYear = 'All'
export function IncidentsListScreen() {
  const router = useRouter()
  const [isLoading, setLoading] = useState(false)
  const [isDataReceived, setIsDataReceived] = useState(false)
  const [isFilter, setIsFilter] = useState(false)
  const [incidentsList, setIncidentsList] = useState([]) as any
  const header = store.getState().headerState.header
  const staticData: any = store.getState().staticDataState.staticData
  const item = useParams<any>()
  let memberData =
    item.memberData !== undefined ? JSON.parse(item.memberData) : {}
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
      month: selectedMonth,
      year: selectedYear
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          // console.log('data', JSON.stringify(data.data.eventList))
          if (data.data.domainObjectPrivileges) {
            incidentsPrivileges = data.data.domainObjectPrivileges.Incident
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
        console.log('error', error)
      })
  }, [])
  useEffect(() => {
    getIncidentDetails()
  }, [])

  function filterEvents(formData: Schema) {
    selectedMonth = monthsList[formData.monthIndex].label
    selectedYear = yearList[formData.yearIndex].label
    getIncidentDetails()
  }
  function resetFilter() {
    selectedMonth = 'All'
    selectedYear = 'All'
    getIncidentDetails()
    reset({
      monthIndex: 0,
      yearIndex: 0
    })
  }
  async function refreshPage() {}
  return (
    <View className="flex-1">
      <PtsLoader loading={isLoading} />
      <View className="flex-row">
        <View className="w-[75%]" />

        {getUserPermission(incidentsPrivileges).createPermission ? (
          <View className="mt-5 self-center">
            <Pressable
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
            </Pressable>
          </View>
        ) : (
          <View />
        )}
        <View className="mt-5 self-center">
          <Pressable
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
          </Pressable>
        </View>
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
        <ScrollView className="m-2 mx-5 w-[95%] self-center">
          {incidentsList.map((data: any, index: number) => {
            return (
              <Pressable
                onPress={() => {
                  router.replace(
                    formatUrl('/circles/incidentDetails', {
                      incidentDetails: JSON.stringify(data),
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
                      {data.type ? data.type : ''}
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
              </Pressable>
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

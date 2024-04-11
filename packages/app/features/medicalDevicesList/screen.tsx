'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Pressable
} from 'react-native'
import PtsLoader from 'app/ui/PtsLoader'
import { Typography } from 'app/ui/typography'
import { Feather } from 'app/ui/icons'
import { COLORS } from 'app/utils/colors'
import store from 'app/redux/store'
import { CallPostService } from 'app/utils/fetchServerData'
import {
  BASE_URL,
  GET_MEDICAL_DEVICES,
  CREATE_MEDICAL_DEVICE
} from 'app/utils/urlConstants'
import { useParams } from 'solito/navigation'
import { AddEditMedicalDevice } from 'app/ui/addEditMedicalDevice'
import { formatUrl } from 'app/utils/format-url'
import { useRouter } from 'solito/navigation'
import { getUserPermission } from 'app/utils/getUserPemissions'
import { ControlledDropdown } from 'app/ui/form-fields/controlled-dropdown'
import { Button } from 'app/ui/button'
import { convertTimeToUserLocalTime, getMonthsList } from 'app/ui/utils'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
const yearList: object[] = [{ label: 'All', value: 0 }] as any
const monthsList = getMonthsList() as any
const schema = z.object({
  monthIndex: z.number(),
  yearIndex: z.number()
})
let selctedMonth = 'All'
let selctedYear = 'All'
let medicalDevicesPrivileges = {}
export type Schema = z.infer<typeof schema>
export function MedicalDevicesListScreen() {
  const [isLoading, setLoading] = useState(false)
  const [devicesList, setDevicesList] = useState([]) as any
  const [isAddDevice, setIsAddDevice] = useState(false)
  const [isDataReceived, setIsDataReceived] = useState(false)
  const [isFilter, setIsFilter] = useState(false)
  const header = store.getState().headerState.header
  const item = useParams<any>()
  const router = useRouter()
  let memberData =
    item.memberData !== undefined ? JSON.parse(item.memberData) : {}
  const staticData: any = store.getState().staticDataState.staticData

  staticData.yearList.map((data: any, index: any) => {
    let object = {
      label: data.name,
      value: index + 1
    }
    yearList.push(object)
  })
  const getDevicesList = useCallback(async (isFromFilter: any) => {
    setLoading(true)
    let url = `${BASE_URL}${GET_MEDICAL_DEVICES}`
    let dataObject: any = {
      header: header,
      purchase: {
        member: {
          id: memberData.member ? memberData.member : ''
        }
      }
    }
    if (isFromFilter) {
      dataObject.month = selctedMonth
      dataObject.year = selctedYear
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          if (data.data.domainObjectPrivileges) {
            medicalDevicesPrivileges = data.data.domainObjectPrivileges.Purchase
              ? data.data.domainObjectPrivileges.Purchase
              : {}
          }
          let list = data.data.list ? data.data.list : []
          setDevicesList(list)
          setIsFilter(false)
          setIsDataReceived(true)
          setIsAddDevice(false)
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
    getDevicesList(false)
  }, [])

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      monthIndex: 0,
      yearIndex: 0
    },
    resolver: zodResolver(schema)
  })

  function filterDevice(formData: Schema) {
    if (formData.monthIndex !== 0) {
      selctedMonth = monthsList[formData.monthIndex].label
    }
    if (formData.yearIndex !== 0) {
      selctedYear = yearList[formData.yearIndex].label
    }
    getDevicesList(true)
  }
  function resetFilter() {
    getDevicesList(false)
    reset({
      monthIndex: 0,
      yearIndex: 0
    })
  }
  const cancelClicked = () => {
    setIsAddDevice(false)
  }
  async function createUpdateMedicalDevice(object: any) {
    // console.log('in createUpdateMedicalDevice', JSON.stringify(object))
    setLoading(true)
    let url = `${BASE_URL}${CREATE_MEDICAL_DEVICE}`
    let dataObject: any = {
      header: header,
      purchase: {
        date: object.date ? object.date : '',
        description: object.description ? object.description : '',
        type: object.selectedType ? object.selectedType : '',
        isPrescribedBy: object.isPrescribed ? object.isPrescribed : false,
        member: {
          id: memberData.member ? memberData.member : ''
        },
        doctor: {
          id: object.doctorId ? object.doctorId : ''
        }
      }
    }
    CallPostService(url, dataObject)
      .then(async (data: any) => {
        if (data.status === 'SUCCESS') {
          setIsAddDevice(false)
          getDevicesList(false)
        } else {
          Alert.alert('', data.message)
        }
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log('error', error)
      })
  }
  return (
    <View className="flex-1">
      <View className="">
        <PtsLoader loading={isLoading} />
        <View className="flex-row ">
          <View className="w-[70%]" />
          {getUserPermission(medicalDevicesPrivileges).createPermission ? (
            <View className=" mt-[20] self-center">
              <TouchableOpacity
                className=" h-[30px] w-[30px] items-center justify-center rounded-[15px] bg-[#c5dbfd]"
                onPress={() => {
                  // router.push(
                  //   formatUrl('/circles/addEditDoctor', {
                  //     memberData: JSON.stringify(memberData)
                  //   })
                  // )
                  setIsAddDevice(true)
                }}
              >
                <Feather name={'plus'} size={25} color={COLORS.primary} />
              </TouchableOpacity>
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
              className=" w-[45%]"
            />
            <ControlledDropdown
              control={control}
              name="yearIndex"
              label="All"
              maxHeight={300}
              list={yearList}
              className="ml-2 w-[45%]"
            />
          </View>
          <View className="flex-row self-center">
            <View className="mt-5 flex-row justify-center ">
              <Button
                className="bg-[#287CFA]"
                title={''}
                leadingIcon="filter"
                variant="default"
                onPress={handleSubmit(filterDevice)}
              />
              <Button
                className="mx-3 bg-[#287CFA]"
                title={''}
                leadingIcon="rotate-ccw"
                variant="default"
                onPress={() => {
                  resetFilter()
                }}
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

      <ScrollView className="m-2 mx-5 w-full self-center">
        {devicesList.map((data: any, index: number) => {
          return (
            <TouchableOpacity
              onPress={() => {
                router.replace(
                  formatUrl('/circles/medicalDeviceDetails', {
                    medicalDevicesDetails: JSON.stringify(data),
                    memberData: JSON.stringify(memberData)
                  })
                )
              }}
              key={index}
              className="border-primary my-[5px] w-full flex-1 self-center rounded-[15px] border-[2px] bg-white py-2"
            >
              <View className="my-2 flex-row">
                <Typography className="text-primary font-400 ml-5 w-[40%]">
                  {data.type ? data.type : ''}
                </Typography>

                <Typography className="ml-5 mr-5 w-[45%] text-right">
                  {data.doctor ? data.doctor : ''}
                </Typography>
              </View>

              <View className="flex-row">
                <View className="w-[95%] flex-row">
                  <Typography className="ml-5 text-black">
                    {data.date ? convertTimeToUserLocalTime(data.date) : ''}
                  </Typography>
                </View>
              </View>
              {data.hasNotes || data.hasReminders ? (
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
              </View>
            </TouchableOpacity>
          )
        })}
        {isDataReceived && devicesList.length === 0 ? (
          <View className="items-center justify-center self-center">
            <Typography className="font-bold">{`No medical devices found`}</Typography>
          </View>
        ) : (
          <View />
        )}
      </ScrollView>

      {isAddDevice ? (
        <View className="h-full w-full ">
          <AddEditMedicalDevice
            medicalDeviceDetails={{}}
            cancelClicked={cancelClicked}
            createUpdateMedicalDevice={createUpdateMedicalDevice}
            memberData={memberData}
          />
        </View>
      ) : (
        <View />
      )}
    </View>
  )
}
